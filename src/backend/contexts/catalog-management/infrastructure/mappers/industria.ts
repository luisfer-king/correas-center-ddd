import type { Prisma } from '../../../../generated/prisma/client.js'
import { Slug, Orden } from '../../../../shared/domain/value-objects.js'
import { Industria } from '../../domain/industria.js'

export type FilaIndustria = Prisma.IndustriaGetPayload<{}>

export function aIndustria(fila: FilaIndustria): Industria {
  return new Industria({
    id: fila.id, empresaId: fila.empresaId, nombre: fila.nombre, slug: Slug.create(fila.slug),
    imagen: fila.imagen, orden: Orden.create(fila.orden),
    estado: fila.estado, fechas: { creadoEn: fila.creadoEn, actualizadoEn: fila.actualizadoEn, eliminadoEn: fila.eliminadoEn },
  })
}
