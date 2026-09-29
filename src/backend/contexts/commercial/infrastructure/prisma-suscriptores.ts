import type { PrismaClient } from '../../../generated/prisma/client.js'
import type { Email } from '../../../shared/domain/value-objects.js'
import type { DatosNuevoSuscriptor, RepositorioSuscriptores } from '../application/ports/repositorio-suscriptores.js'
import { idCRM } from '../domain/commercial-values.js'
import type { Suscriptor } from '../domain/suscriptor.js'
import { aSuscriptor } from './mappers/suscriptor.js'
import {
    auditarCambio, empresaActiva, paginaCrm, permitirGestion,
    sinEliminados, transaccionCrm, versionCrm
} from './operaciones-crm.js'

export class PrismaSuscriptores implements RepositorioSuscriptores {
    constructor(private readonly db: PrismaClient) { }

    async buscarPorId(id: bigint, incluirEliminados: boolean): Promise<Suscriptor | null> {
        const fila = await this.db.suscriptor.findFirst({
            where: {
                id: idCRM(id), ...sinEliminados(incluirEliminados)
            }
        })
        return fila === null ? null : aSuscriptor(fila)
    }

    async buscarPorEmail(email: Email, incluirEliminados: boolean): Promise<Suscriptor | null> {
        const fila = await this.db.suscriptor.findFirst({
            where: {
                email: email.value, ...sinEliminados(incluirEliminados)
            }
        })
        return fila === null ? null : aSuscriptor(fila)
    }

    async listar(pagina: number, incluirEliminados: boolean): Promise<readonly Suscriptor[]> {
        const filas = await this.db.suscriptor.findMany({
            where: sinEliminados(incluirEliminados),
            orderBy: { id: 'desc' }, skip: paginaCrm(pagina), take: 100
        })
        return filas.map(aSuscriptor)
    }

    async crear(datos: DatosNuevoSuscriptor, actorId: string): Promise<Suscriptor> {
        return transaccionCrm(this.db, async (tx) => {
            await permitirGestion(tx, actorId, 'suscriptores')
            await empresaActiva(tx, datos.empresaId)
            const ahora = new Date()
            const fila = await tx.suscriptor.create({
                data: {
                    empresaId: datos.empresaId, email: datos.email.value,
                    nombre: datos.nombre, estado: 'activo', emailVerificadoEn: null,
                    creadoEn: ahora, actualizadoEn: ahora,
                }
            })
            const suscriptor = aSuscriptor(fila)
            await auditarCambio(tx, actorId, 'suscriptores', fila.id.toString(), null, suscriptor.estado)
            return suscriptor
        })
    }

    async guardar(suscriptor: Suscriptor, versionAnterior: Date, actorId: string): Promise<void> {
        await transaccionCrm(this.db, async (tx) => {
            await permitirGestion(tx, actorId, 'suscriptores')
            const anterior = await tx.suscriptor.findUnique({
                where: { id: suscriptor.id },
                select: { empresaId: true, email: true, estado: true, eliminadoEn: true }
            })
            if (!anterior || anterior.empresaId !== suscriptor.empresaId ||
                anterior.email !== suscriptor.email.value || anterior.eliminadoEn !== null) {
                throw new Error('Suscriptor no disponible')
            }
            const resultado = await tx.suscriptor.updateMany({
                where: {
                    id: suscriptor.id, empresaId: suscriptor.empresaId,
                    actualizadoEn: versionCrm(versionAnterior), eliminadoEn: null,
                }, data: {
                    nombre: suscriptor.nombre, estado: suscriptor.estado,
                    // La confirmación debe autorizarse previamente mediante token válido.
                    emailVerificadoEn: suscriptor.emailVerificadoEn,
                    eliminadoEn: suscriptor.eliminadoEn, actualizadoEn: suscriptor.actualizadoEn
                }
            })
            if (resultado.count !== 1) throw new Error('Suscriptor modificado por otra operación')
            await auditarCambio(tx, actorId, 'suscriptores', suscriptor.id.toString(),
                anterior.estado, suscriptor.estado, suscriptor.eliminadoEn)
        })
    }
}
