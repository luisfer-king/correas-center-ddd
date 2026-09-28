import type { PrismaClient } from '../../../generated/prisma/client.js'
import type { DatosNuevaEmpresa, RepositorioEmpresas } from '../application/ports/repositorio-empresas.js'
import { idCRM } from '../domain/commercial-values.js'
import type { Empresa } from '../domain/empresa.js'
import { aEmpresa } from './mappers/empresa.js'
import {
    auditarCambio, paginaCrm, permitirGestion, sinEliminados,
    transaccionCrm, versionCrm
} from './operaciones-crm.js'

export class PrismaEmpresas implements RepositorioEmpresas {
    constructor(private readonly db: PrismaClient) { }

    async buscarPorId(id: bigint, incluirEliminados: boolean): Promise<Empresa | null> {
        const fila = await this.db.empresa.findFirst({ where: { id: idCRM(id), ...sinEliminados(incluirEliminados) } })
        return fila === null ? null : aEmpresa(fila)
    }

    async listar(pagina: number, incluirEliminados: boolean): Promise<readonly Empresa[]> {
        const filas = await this.db.empresa.findMany({
            where: sinEliminados(incluirEliminados),
            orderBy: { id: 'desc' }, skip: paginaCrm(pagina), take: 100
        })
        return filas.map(aEmpresa)
    }

    async crear(datos: DatosNuevaEmpresa, actorId: string): Promise<Empresa> {
        return transaccionCrm(this.db, async (tx) => {
            await permitirGestion(tx, actorId, 'empresas')
            const ahora = new Date()
            const fila = await tx.empresa.create({
                data: {
                    nombre: datos.nombre, logo: datos.logo,
                    estado: 'activo', creadoEn: ahora, actualizadoEn: ahora
                }
            })
            const empresa = aEmpresa(fila)
            await auditarCambio(tx, actorId, 'empresas', fila.id.toString(), null, empresa.estado)
            return empresa
        })
    }

    async guardar(empresa: Empresa, versionAnterior: Date, actorId: string): Promise<void> {
        await transaccionCrm(this.db, async (tx) => {
            await permitirGestion(tx, actorId, 'empresas')
            const anterior = await tx.empresa.findUnique({
                where: { id: empresa.id },
                select: { estado: true, eliminadoEn: true }
            })
            if (!anterior || anterior.eliminadoEn !== null) throw new Error('Empresa no disponible')
            const resultado = await tx.empresa.updateMany({
                where: {
                    id: empresa.id, actualizadoEn: versionCrm(versionAnterior), eliminadoEn: null,
                }, data: {
                    nombre: empresa.nombre, logo: empresa.logo, estado: empresa.estado,
                    eliminadoEn: empresa.eliminadoEn, actualizadoEn: empresa.actualizadoEn
                }
            })
            if (resultado.count !== 1) throw new Error('Empresa modificada por otra operación')
            await auditarCambio(tx, actorId, 'empresas', empresa.id.toString(), anterior.estado, empresa.estado)
        })
    }
}
