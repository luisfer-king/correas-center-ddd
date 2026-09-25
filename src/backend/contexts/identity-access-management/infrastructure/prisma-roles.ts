import { Prisma, type PrismaClient } from '../../../generated/prisma/client.js'
import type { RepositorioRoles } from '../application/ports/repositorio-roles.js'
import { EventoAuditoria } from '../domain/evento-auditoria.js'
import { idPositivo } from '../domain/iam-values.js'
import type { Rol } from '../domain/rol.js'
import { exigirPermisoEnTransaccion } from './exigir-permiso-en-transaccion.js'
import { insertarAuditoria } from './insertar-auditoria.js'
import { aRol } from './mappers/rol.js'

export class PrismaRoles implements RepositorioRoles {
    constructor(private readonly db: PrismaClient) { }
    async buscarPorId(id: bigint): Promise<Rol | null> {
        const fila = await this.db.rol.findUnique({ where: { id: idPositivo(id) }, include: { relRolPermiso: true } })
        return fila ? aRol(fila) : null
    }
    async buscarPorSlug(slug: string): Promise<Rol | null> {
        const fila = await this.db.rol.findUnique({ where: { slug }, include: { relRolPermiso: true } })
        return fila ? aRol(fila) : null
    }
    async listar(): Promise<readonly Rol[]> {
        const filas = await this.db.rol.findMany({ orderBy: { nombre: 'asc' }, include: { relRolPermiso: true } })
        return filas.map(aRol)
    }
    async crear(datos: { nombre: string; slug: string; descripcion: string | null }, actorId: string): Promise<Rol> {
        return this.db.$transaction(async (tx) => {
            await exigirPermisoEnTransaccion(tx, actorId, 'iam.roles.create')
            const fila = await tx.rol.create({
                data: {
                    nombre: datos.nombre, slug: datos.slug, descripcion: datos.descripcion,
                    esSistema: false, estado: 'activo',
                }, include: { relRolPermiso: true }
            })
            await insertarAuditoria(tx, EventoAuditoria.registrar({
                usuarioId: actorId, accion: 'Creación', tablaAfectada: 'roles',
                registroId: fila.id.toString(), datosAnteriores: null,
                datosNuevos: { id: fila.id.toString(), slug: fila.slug },
                ipAddress: null, userAgent: null, metadata: { operacion: 'iam.roles.create' },
                creadoEn: new Date(),
            }))
            return aRol(fila)
        }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable })
    }
    async guardar(rol: Rol, versionAnterior: Date, actorId: string,
        permiso: 'iam.roles.update' | 'iam.roles.delete' | 'iam.roles.permisos.assign'): Promise<void> {
        await this.db.$transaction(async (tx) => {
            await exigirPermisoEnTransaccion(tx, actorId, permiso)
            const anterior = await tx.rol.findUnique({ where: { id: rol.id }, select: { esSistema: true, nombre: true, estado: true } })
            if (!anterior || anterior.esSistema !== rol.esSistema) throw new Error('Rol inexistente o protegido')
            if (anterior.esSistema && rol.estado !== 'activo') throw new Error('Rol del sistema protegido')
            if (anterior.esSistema && anterior.nombre !== rol.nombre) throw new Error('No se puede renombrar el rol del sistema')
            if (anterior.esSistema && rol.asignacionesPermisos.some((v) => v.estado === 'inactivo')) {
                throw new Error('No se puede retirar permisos del rol del sistema')
            }
            const activos = rol.asignacionesPermisos.filter((v) => v.estado === 'activo').map((v) => v.permisoId)
            const validos = await tx.permiso.count({ where: { id: { in: activos }, estado: 'activo', eliminadoEn: null } })
            if (validos !== activos.length) throw new Error('No se puede asignar un permiso inexistente o inactivo')
            const actualizado = await tx.rol.updateMany({
                where: { id: rol.id, actualizadoEn: versionAnterior }, data: {
                    nombre: rol.nombre, descripcion: rol.descripcion, estado: rol.estado,
                    eliminadoEn: rol.eliminadoEn, actualizadoEn: rol.actualizadoEn,
                }
            })
            if (actualizado.count !== 1) throw new Error('Rol modificado por otra operación; vuelve a cargarlo')
            for (const v of rol.asignacionesPermisos) {
                await tx.rolPermiso.upsert({
                    where: { rolId_permisoId: { rolId: v.rolId, permisoId: v.permisoId } },
                    create: { rolId: v.rolId, permisoId: v.permisoId, creadoEn: v.creadoEn, estado: v.estado },
                    update: { estado: v.estado },
                })
            }
            await insertarAuditoria(tx, EventoAuditoria.registrar({
                usuarioId: actorId, accion: rol.estado === 'eliminado' ? 'Eliminación' : 'Edición',
                tablaAfectada: 'roles', registroId: rol.id.toString(),
                datosAnteriores: { estado: anterior.estado }, datosNuevos: { estado: rol.estado },
                ipAddress: null, userAgent: null, metadata: { operacion: permiso },
                creadoEn: new Date(),
            }))
        }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable })
    }
}