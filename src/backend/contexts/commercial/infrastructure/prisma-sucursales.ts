import type { PrismaClient } from '../../../generated/prisma/client.js'
import type { DatosNuevaSucursal, RepositorioSucursales } from '../application/ports/repositorio-sucursales.js'
import { idCRM } from '../domain/commercial-values.js'
import type { Sucursal } from '../domain/sucursal.js'
import { aSucursal } from './mappers/sucursal.js'
import {
    auditarCambio, empresaActiva, paginaCrm, permitirGestion,
    sinEliminados, transaccionCrm, versionCrm, type TransaccionCrm
} from './operaciones-crm.js'

// Las dos operaciones sobre la sucursal principal se serializan por empresa.
async function bloquearPrincipal(tx: TransaccionCrm, empresaId: bigint): Promise<void> {
    await tx.$queryRaw`SELECT pg_advisory_xact_lock(${empresaId})::text`
}

async function retirarOtrasPrincipales(tx: TransaccionCrm, empresaId: bigint,
    sucursalId: bigint | null, cuando: Date): Promise<void> {
    await tx.sucursal.updateMany({
        where: {
            empresaId, esPrincipal: true,
            ...(sucursalId === null ? {} : { id: { not: sucursalId } })
        },
        data: { esPrincipal: false, actualizadoEn: cuando }
    })
}

export class PrismaSucursales implements RepositorioSucursales {
    constructor(private readonly db: PrismaClient) { }

    async buscarPorId(id: bigint, incluirEliminados: boolean): Promise<Sucursal | null> {
        const fila = await this.db.sucursal.findFirst({ where: { id: idCRM(id), ...sinEliminados(incluirEliminados) } })
        return fila === null ? null : aSucursal(fila)
    }

    async listar(pagina: number, incluirEliminados: boolean): Promise<readonly Sucursal[]> {
        const filas = await this.db.sucursal.findMany({
            where: sinEliminados(incluirEliminados),
            orderBy: [{ empresaId: 'asc' }, { orden: 'asc' }, { id: 'asc' }],
            skip: paginaCrm(pagina), take: 100
        })
        return filas.map(aSucursal)
    }

    async listarPorEmpresa(empresaId: bigint, incluirEliminados: boolean): Promise<readonly Sucursal[]> {
        const filas = await this.db.sucursal.findMany({
            where: {
                empresaId: idCRM(empresaId),
                ...sinEliminados(incluirEliminados)
            }, orderBy: [{ orden: 'asc' }, { id: 'asc' }]
        })
        return filas.map(aSucursal)
    }

    async crear(datos: DatosNuevaSucursal, actorId: string): Promise<Sucursal> {
        return transaccionCrm(this.db, async (tx) => {
            await permitirGestion(tx, actorId, 'sucursales')
            await empresaActiva(tx, datos.empresaId)
            if (datos.esPrincipal) await bloquearPrincipal(tx, datos.empresaId)
            const ahora = new Date()
            if (datos.esPrincipal) await retirarOtrasPrincipales(tx, datos.empresaId, null, ahora)
            const fila = await tx.sucursal.create({
                data: {
                    empresaId: datos.empresaId, nombre: datos.datos.nombre,
                    direccion: datos.datos.direccion, telefono: datos.datos.telefono,
                    email: datos.datos.email?.value ?? null, horarios: datos.datos.horarios,
                    mapaIncrustado: datos.datos.mapaIncrustado,
                    latitud: datos.datos.ubicacion.latitud,
                    longitud: datos.datos.ubicacion.longitud,
                    esPrincipal: datos.esPrincipal, orden: datos.orden.value,
                    estado: 'activo', creadoEn: ahora, actualizadoEn: ahora,
                }
            })
            const sucursal = aSucursal(fila)
            await auditarCambio(tx, actorId, 'sucursales', fila.id.toString(), null, sucursal.estado)
            return sucursal
        })
    }

    async guardar(sucursal: Sucursal, versionAnterior: Date, actorId: string): Promise<void> {
        await transaccionCrm(this.db, async (tx) => {
            await permitirGestion(tx, actorId, 'sucursales')
            // Todas las escrituras de la sucursal participan del mismo bloqueo para
            // impedir que una edición tardía revierta la elección de principal.
            await bloquearPrincipal(tx, sucursal.empresaId)
            const anterior = await tx.sucursal.findUnique({
                where: { id: sucursal.id },
                select: { empresaId: true, estado: true, eliminadoEn: true }
            })
            if (!anterior || anterior.empresaId !== sucursal.empresaId || anterior.eliminadoEn !== null) {
                throw new Error('Sucursal no disponible')
            }
            if (sucursal.estado === 'activo') await empresaActiva(tx, sucursal.empresaId)
            const principal = sucursal.estado === 'activo' && sucursal.esPrincipal
            const resultado = await tx.sucursal.updateMany({
                where: {
                    id: sucursal.id, empresaId: sucursal.empresaId,
                    actualizadoEn: versionCrm(versionAnterior), eliminadoEn: null,
                }, data: {
                    nombre: sucursal.datos.nombre, direccion: sucursal.datos.direccion,
                    telefono: sucursal.datos.telefono, email: sucursal.datos.email?.value ?? null,
                    horarios: sucursal.datos.horarios, mapaIncrustado: sucursal.datos.mapaIncrustado,
                    latitud: sucursal.datos.ubicacion.latitud, longitud: sucursal.datos.ubicacion.longitud,
                    orden: sucursal.orden.value, esPrincipal: principal,
                    estado: sucursal.estado, eliminadoEn: sucursal.eliminadoEn,
                    actualizadoEn: sucursal.actualizadoEn,
                }
            })
            if (resultado.count !== 1) throw new Error('Sucursal modificada por otra operación')
            if (principal) await retirarOtrasPrincipales(tx, sucursal.empresaId, sucursal.id,
                sucursal.actualizadoEn)
            await auditarCambio(tx, actorId, 'sucursales', sucursal.id.toString(),
                anterior.estado, sucursal.estado)
        })
    }
}
