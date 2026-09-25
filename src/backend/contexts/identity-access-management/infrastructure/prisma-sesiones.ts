import { Prisma, type PrismaClient } from '../../../generated/prisma/client.js'
import type { RepositorioSesiones } from '../application/ports/repositorio-sesiones.js'
import type { EventoAuditoria } from '../domain/evento-auditoria.js'
import { uuid } from '../domain/iam-values.js'
import type { Sesion } from '../domain/sesion.js'
import { insertarAuditoria } from './insertar-auditoria.js'
import { aSesion } from './mappers/sesion.js'

export class PrismaSesiones implements RepositorioSesiones {
    constructor(private readonly db: PrismaClient) { }
    async crear(sesion: Sesion, evento: EventoAuditoria): Promise<void> {
        if (evento.usuarioId !== sesion.usuarioId) throw new Error('Autoría de sesión inconsistente')
        await this.db.$transaction(async (tx) => {
            const perfil = await tx.perfil.findFirst({
                where: {
                    id: sesion.usuarioId, estado: 'activo', eliminadoEn: null,
                    emailVerifiedAt: { not: null },
                }, select: { id: true }
            })
            if (!perfil) throw new Error('Cuenta no habilitada')
            await tx.sesion.create({
                data: {
                    id: sesion.id, usuarioId: sesion.usuarioId,
                    huellaToken: sesion.huellaTokenParaPersistencia, expiraEn: sesion.expiraEn,
                    revocadaEn: null, estado: 'activo', creadoEn: sesion.creadoEn,
                    actualizadoEn: sesion.actualizadoEn,
                }
            })
            await insertarAuditoria(tx, evento)
        }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable })
    }
    async buscarPorId(id: string): Promise<Sesion | null> {
        const fila = await this.db.sesion.findUnique({ where: { id: uuid(id) } })
        return fila ? aSesion(fila) : null
    }
    async revocar(sesion: Sesion, evento: EventoAuditoria): Promise<void> {
        if (evento.usuarioId !== sesion.usuarioId || !sesion.revocadaEn) {
            throw new Error('Revocación o autoría inconsistente')
        }
        await this.db.$transaction(async (tx) => {
            const actualizado = await tx.sesion.updateMany({
                where: { id: sesion.id, usuarioId: sesion.usuarioId, estado: 'activo', revocadaEn: null },
                data: { estado: 'inactivo', revocadaEn: sesion.revocadaEn, actualizadoEn: sesion.actualizadoEn },
            })
            if (actualizado.count !== 1) throw new Error('Sesión ya revocada')
            await insertarAuditoria(tx, evento)
        }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable })
    }
}