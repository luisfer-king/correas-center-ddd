import type { Prisma } from '../../../../generated/prisma/client.js'
import { Slug, Orden } from '../../../../shared/domain/value-objects.js'
import { Producto } from '../../domain/producto.js'

export type FilaProducto = Prisma.ProductoGetPayload<{}>

export function aProducto(fila: FilaProducto): Producto {
  return new Producto({
    id: fila.id, empresaId: fila.empresaId, nombre: fila.nombre, slug: Slug.create(fila.slug),
    imagen: fila.imagen, orden: Orden.create(fila.orden),
    estado: fila.estado, fechas: { creadoEn: fila.creadoEn, actualizadoEn: fila.actualizadoEn, eliminadoEn: fila.eliminadoEn },
  })
}
