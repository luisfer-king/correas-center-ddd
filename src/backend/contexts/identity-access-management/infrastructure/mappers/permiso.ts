import type { Prisma } from '../../../../generated/prisma/client.js'
import { CodigoPermiso } from '../../domain/iam-values.js'
import { Permiso } from '../../domain/permiso.js'

export type FilaPermiso = Prisma.PermisoGetPayload<{}>

export function aPermiso(fila: FilaPermiso): Permiso {
    return new Permiso({
        id: fila.id, nombre: fila.nombre, slug: CodigoPermiso.create(fila.slug),
        grupo: fila.grupo, descripcion: fila.descripcion, estado: fila.estado,
        fechas: { creadoEn: fila.creadoEn, actualizadoEn: fila.actualizadoEn, eliminadoEn: fila.eliminadoEn },
    })
}