import { argon2id, hash, verify } from 'argon2'
import { Prisma, type PrismaClient } from '../../../generated/prisma/client.js'
import type { RepositorioMiPerfil } from '../application/ports/repositorio-mi-perfil.js'
import { EventoAuditoria } from '../domain/evento-auditoria.js'
import { insertarAuditoria } from './insertar-auditoria.js'
import { aPerfil } from './mappers/perfil.js'

export class PrismaMiPerfil implements RepositorioMiPerfil {
    constructor(private readonly db: PrismaClient) { }

    async actualizar(actorId: string, datos: { nombreCompleto: string; telefono: string | null }, version: Date) {
        return this.db.$transaction(async (tx) => {
            const anterior = await tx.perfil.findUnique({
                where: { id: actorId }, select: {
                    nombreCompleto: true, telefono: true, estado: true,
                }
            })
            if (!anterior || anterior.estado !== 'activo') throw new Error('Perfil no encontrado')
            const cambio = await tx.perfil.updateMany({
                where: { id: actorId, estado: 'activo', actualizadoEn: version },
                data: { nombreCompleto: datos.nombreCompleto, telefono: datos.telefono }
            })
            if (cambio.count !== 1) throw new Error('Perfil modificado por otra operación; vuelve a cargarlo')
            await insertarAuditoria(tx, EventoAuditoria.registrar({
                usuarioId: actorId, accion: 'Edición', tablaAfectada: 'perfiles', registroId: actorId,
                datosAnteriores: { nombreCompleto: anterior.nombreCompleto, telefono: anterior.telefono },
                datosNuevos: { nombreCompleto: datos.nombreCompleto, telefono: datos.telefono },
                ipAddress: null, userAgent: null, metadata: { operacion: 'iam.mi_perfil.update' }, creadoEn: new Date(),
            }))
            return aPerfil(await tx.perfil.findUniqueOrThrow({ where: { id: actorId }, include: { relUsuarioRol: true } }))
        }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable })
    }

    async cambiarClave(actorId: string, actual: string, nueva: string) {
        // Hash fuera de la transacción; la clave anterior se verifica otra vez dentro de ella.
        const hashNuevo = await hash(nueva, { type: argon2id, memoryCost: 19456, timeCost: 2, parallelism: 1 })
        await this.db.$transaction(async (tx) => {
            const cuenta = await tx.usuario.findUnique({
                where: { id: actorId }, select: {
                    encryptedPassword: true, relPerfil: { select: { estado: true } },
                }
            })
            if (!cuenta?.encryptedPassword || cuenta.relPerfil?.estado !== 'activo' ||
                !await verify(cuenta.encryptedPassword, actual)) throw new Error('Contraseña actual incorrecta')
            await tx.usuario.update({ where: { id: actorId }, data: { encryptedPassword: hashNuevo } })
            await tx.sesion.updateMany({
                where: { usuarioId: actorId, estado: 'activo' },
                data: { estado: 'inactivo', revocadaEn: new Date() }
            })
            await insertarAuditoria(tx, EventoAuditoria.registrar({
                usuarioId: actorId, accion: 'Edición', tablaAfectada: 'users', registroId: actorId,
                datosAnteriores: null, datosNuevos: null, ipAddress: null, userAgent: null,
                metadata: { operacion: 'iam.mi_perfil.cambiar_clave' }, creadoEn: new Date(),
            }))
        }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable })
    }
}
