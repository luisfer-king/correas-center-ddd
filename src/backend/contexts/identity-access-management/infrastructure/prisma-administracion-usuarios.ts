import { Prisma, type PrismaClient } from '../../../generated/prisma/client.js'
import type { RepositorioAdministracionUsuarios } from '../application/ports/repositorio-administracion-usuarios.js'
import { EventoAuditoria } from '../domain/evento-auditoria.js'
import { exigirPermisoEnTransaccion } from './exigir-permiso-en-transaccion.js'
import { insertarAuditoria } from './insertar-auditoria.js'
import { aPerfil } from './mappers/perfil.js'

export class PrismaAdministracionUsuarios implements RepositorioAdministracionUsuarios {
    constructor(private readonly db: PrismaClient) { }

    async crear(datos: { nombreCompleto: string; email: string; telefono: string | null; hash: string }, actorId: string) {
        return this.db.$transaction(async (tx) => {
            await exigirPermisoEnTransaccion(tx, actorId, 'iam.usuarios.create')
            const cuenta = await tx.usuario.create({ data: { email: datos.email, encryptedPassword: datos.hash } })
            // El administrador valida el correo en el momento de aprovisionar la cuenta.
            const fila = await tx.perfil.create({
                data: {
                    id: cuenta.id, nombreCompleto: datos.nombreCompleto, telefono: datos.telefono,
                    email: datos.email, emailVerifiedAt: new Date(), estado: 'activo',
                }, include: { relUsuarioRol: true }
            })
            await insertarAuditoria(tx, EventoAuditoria.registrar({
                usuarioId: actorId, accion: 'Creación', tablaAfectada: 'perfiles', registroId: fila.id,
                datosAnteriores: null, datosNuevos: { id: fila.id, email: fila.email, estado: fila.estado },
                ipAddress: null, userAgent: null, metadata: { operacion: 'iam.usuarios.create' }, creadoEn: new Date(),
            }))
            return aPerfil(fila)
        }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable })
    }

    async actualizar(id: string, datos: { nombreCompleto: string; email: string; telefono: string | null },
        version: Date, actorId: string) {
        return this.db.$transaction(async (tx) => {
            await exigirPermisoEnTransaccion(tx, actorId, 'iam.usuarios.update')
            const anterior = await tx.perfil.findUnique({
                where: { id }, select: {
                    email: true, nombreCompleto: true,
                    telefono: true, estado: true
                }
            })
            if (!anterior || anterior.estado === 'eliminado') throw new Error('Usuario no encontrado')
            const cambioEmail = anterior.email !== datos.email
            const actualizado = await tx.perfil.updateMany({
                where: { id, actualizadoEn: version, estado: { not: 'eliminado' } },
                data: {
                    nombreCompleto: datos.nombreCompleto, telefono: datos.telefono, email: datos.email,
                    ...(cambioEmail ? { emailVerifiedAt: new Date() } : {})
                }
            })
            if (actualizado.count !== 1) throw new Error('Perfil modificado por otra operación; vuelve a cargarlo')
            if (cambioEmail) await tx.usuario.update({ where: { id }, data: { email: datos.email } })
            await insertarAuditoria(tx, EventoAuditoria.registrar({
                usuarioId: actorId, accion: 'Edición', tablaAfectada: 'perfiles', registroId: id,
                datosAnteriores: { email: anterior.email, nombreCompleto: anterior.nombreCompleto, telefono: anterior.telefono },
                datosNuevos: { email: datos.email, nombreCompleto: datos.nombreCompleto, telefono: datos.telefono },
                ipAddress: null, userAgent: null, metadata: { operacion: 'iam.usuarios.update' }, creadoEn: new Date(),
            }))
            const fila = await tx.perfil.findUniqueOrThrow({ where: { id }, include: { relUsuarioRol: true } })
            return aPerfil(fila)
        }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable })
    }

    async cambiarEstado(id: string, estado: 'activo' | 'inactivo' | 'eliminado', version: Date, actorId: string) {
        const permiso = estado === 'eliminado' ? 'iam.usuarios.delete' : 'iam.usuarios.update'
        await this.db.$transaction(async (tx) => {
            await exigirPermisoEnTransaccion(tx, actorId, permiso,
                estado === 'eliminado' ? ['super_admin', 'administrador', 'admin'] : undefined)
            if (actorId === id && estado !== 'activo') throw new Error('No puedes dar de baja tu propia cuenta')
            const anterior = await tx.perfil.findUnique({ where: { id }, select: { estado: true } })
            if (!anterior) throw new Error('Usuario no encontrado')
            if (estado === 'activo' ? anterior.estado !== 'inactivo' :
                estado === 'inactivo' ? anterior.estado !== 'activo' : anterior.estado === 'eliminado') {
                throw new Error('Estado de usuario incompatible')
            }
            if (estado !== 'activo') {
                const superRol = await tx.rol.findUnique({ where: { slug: 'super_admin' }, select: { id: true } })
                if (superRol) {
                    const relacion = await tx.usuarioRol.findUnique({ where: { usuarioId_rolId: { usuarioId: id, rolId: superRol.id } } })
                    if (relacion?.estado === 'activo') {
                        const restantes = await tx.usuarioRol.count({
                            where: {
                                rolId: superRol.id, estado: 'activo', usuarioId: { not: id },
                                perfil: { estado: 'activo', eliminadoEn: null },
                            }
                        })
                        if (restantes === 0) throw new Error('No se puede retirar el último superadministrador activo')
                    }
                }
            }
            const actualizado = await tx.perfil.updateMany({
                where: { id, actualizadoEn: version, estado: anterior.estado },
                data: { estado, eliminadoEn: estado === 'eliminado' ? new Date() : null }
            })
            if (actualizado.count !== 1) throw new Error('Perfil modificado por otra operación; vuelve a cargarlo')
            if (estado !== 'activo') await tx.sesion.updateMany({
                where: { usuarioId: id, estado: 'activo' },
                data: { estado: 'inactivo', revocadaEn: new Date() }
            })
            await insertarAuditoria(tx, EventoAuditoria.registrar({
                usuarioId: actorId, accion: estado === 'eliminado' ? 'Eliminación' : 'Edición',
                tablaAfectada: 'perfiles', registroId: id, datosAnteriores: { estado: anterior.estado },
                datosNuevos: { estado }, ipAddress: null, userAgent: null,
                metadata: { operacion: permiso }, creadoEn: new Date(),
            }))
        }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable })
    }
}
