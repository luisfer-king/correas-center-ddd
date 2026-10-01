import type { Prisma } from '../../../../generated/prisma/client.js'
import { Orden, Slug } from '../../../../shared/domain/value-objects.js'
import { Categoria } from '../../domain/categoria.js'

export type FilaCategoria = Prisma.CategoriaGetPayload<{}>

export function aCategoria(fila: FilaCategoria): Categoria {
  return new Categoria({
    id: fila.id, productoId: fila.productoId, nombre: fila.nombre, slug: Slug.rutaCategoria(fila.slug),
    imagen: fila.imagen, descripcion: fila.descripcion, descripcionCorta: fila.descripcionCorta,
    uso: fila.uso, orden: Orden.create(fila.orden),
    estado: fila.estado, fechas: { creadoEn: fila.creadoEn, actualizadoEn: fila.actualizadoEn, eliminadoEn: fila.eliminadoEn },
  })
}
