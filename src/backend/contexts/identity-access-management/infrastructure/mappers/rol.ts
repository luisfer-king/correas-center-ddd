import type { Prisma } from '../../../../generated/prisma/client.js'
import { Slug } from '../../../../shared/domain/value-objects.js'
import { RolPermiso } from '../../domain/rol-permiso.js'
import { Rol } from '../../domain/rol.js'

export type FilaRol = Prisma.RolGetPayload<{ include: { relRolPermiso: true } }>

export function aRol(fila: FilaRol): Rol {
    return new Rol({
        id: fila.id, nombre: fila.nombre, slug: Slug.create(fila.slug), descripcion: fila.descripcion,
        esSistema: fila.esSistema, estado: fila.estado,
        fechas: { creadoEn: fila.creadoEn, actualizadoEn: fila.actualizadoEn, eliminadoEn: fila.eliminadoEn },
        permisos: fila.relRolPermiso.map((v) => new RolPermiso(v.rolId, v.permisoId, v.creadoEn, v.estado)),
    })
}