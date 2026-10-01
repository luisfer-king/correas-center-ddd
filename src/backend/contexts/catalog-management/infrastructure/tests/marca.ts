import type { Prisma } from '../../../../generated/prisma/client.js'
import { Slug, Orden } from '../../../../shared/domain/value-objects.js'
import { Marca } from '../../domain/marca.js'

export type FilaMarca = Prisma.MarcaGetPayload<{}>

export function aMarca(fila: FilaMarca): Marca {
  return new Marca({
    id: fila.id, nombre: fila.nombre, slug: Slug.create(fila.slug), logo: fila.logo,
    orden: Orden.create(fila.orden),
    estado: fila.estado, fechas: { creadoEn: fila.creadoEn, actualizadoEn: fila.actualizadoEn, eliminadoEn: fila.eliminadoEn },
  })
}
