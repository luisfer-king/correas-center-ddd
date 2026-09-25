import { Prisma, type PrismaClient } from '../../../generated/prisma/client.js'
import type { RepositorioPerfiles } from '../application/ports/repositorio-perfiles.js'
import { EventoAuditoria } from '../domain/evento-auditoria.js'
import { uuid } from '../domain/iam-values.js'
import type { Perfil } from '../domain/perfil.js'
import { exigirPermisoEnTransaccion } from './exigir-permiso-en-transaccion.js'
import { insertarAuditoria } from './insertar-auditoria.js'
import { aPerfil } from './mappers/perfil.js'

export class PrismaPerfiles implements RepositorioPerfiles {
    constructor(private readonly db: PrismaClient) { }
    async buscarPorId(id: string): Promise<Perfil | null> {
        const fila = await this.db.perfil.findUnique({ where: { id: uuid(id) }, include: { relUsuarioRol: true } })
        return fila ? aPerfil(fila) : null
    }
    async listar(): Promise<readonly Perfil[]> {
        const filas = await this.db.perfil.findMany({
            orderBy: { nombreCompleto: 'asc' }, include: { relUsuarioRol: true },
        })
        return filas.map(aPerfil)
    }
    async guardar(perfil: Perfil, versionAnterior: Date, actorId: string): Promise<void> {
        await this.db.$transaction(async (tx) => {
            await exigirPermisoEnTransaccion(tx, actorId, 'iam.usuarios.roles.assign')
            const anterior = await tx.perfil.findUnique({ where: { id: perfil.id }, select: { email: true } })
            if (!anterior) throw new Error('Perfil inexistente')
            if (anterior.email !== (perfil.email?.value ?? null)) {
                throw new Error('Cambiar el email exige sincronizar auth.users y el perfil en otro caso de uso')
            }
            const activos = perfil.asignacionesRoles.filter((v) => v.estado === 'activo').map((v) => v.rolId)
            const validos = await tx.rol.count({ where: { id: { in: activos }, estado: 'activo', eliminadoEn: null } })
            if (validos !== activos.length) throw new Error('No se puede asignar un rol inexistente o inactivo')
            const sistema = await tx.rol.findUnique({ where: { slug: 'super_admin' }, select: { id: true } })
            if (sistema && !activos.includes(sistema.id)) {
                const tieneSuperAdmin = await tx.usuarioRol.findUnique({
                    where: { usuarioId_rolId: { usuarioId: perfil.id, rolId: sistema.id } },
                    select: { estado: true },
                })
                if (tieneSuperAdmin?.estado === 'activo') {
                    const restantes = await tx.usuarioRol.count({
                        where: {
                            rolId: sistema.id, estado: 'activo', usuarioId: { not: perfil.id },
                            perfil: { estado: 'activo', eliminadoEn: null },
                        }
                    })
                    if (restantes === 0) throw new Error('No se puede retirar el último superadministrador activo')
                }
            }
            const actualizado = await tx.perfil.updateMany({
                where: { id: perfil.id, actualizadoEn: versionAnterior }, data: {
                    nombreCompleto: perfil.nombreCompleto, telefono: perfil.telefono,
                    avatarUrl: perfil.avatarUrl,
                    emailVerifiedAt: perfil.emailVerifiedAt, estado: perfil.estado,
                    eliminadoEn: perfil.eliminadoEn, actualizadoEn: perfil.actualizadoEn,
                }
            })
            if (actualizado.count !== 1) throw new Error('Perfil modificado por otra operación; vuelve a cargarlo')
            for (const v of perfil.asignacionesRoles) {
                await tx.usuarioRol.upsert({
                    where: { usuarioId_rolId: { usuarioId: v.usuarioId, rolId: v.rolId } },
                    create: { usuarioId: v.usuarioId, rolId: v.rolId, creadoEn: v.creadoEn, estado: v.estado },
                    update: { estado: v.estado },
                })
            }
            await insertarAuditoria(tx, EventoAuditoria.registrar({
                usuarioId: actorId, accion: 'Edición', tablaAfectada: 'usuario_rol',
                registroId: perfil.id, datosAnteriores: null, datosNuevos: null,
                ipAddress: null, userAgent: null, metadata: { operacion: 'iam.usuarios.roles.assign' },
                creadoEn: new Date(),
            }))
        }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable })
    }
}