import type { Prisma } from '../../../../generated/prisma/client.js'
import { ordenNullable } from '../../domain/catalog-values.js'
import { AsignacionMarca } from '../../domain/asignacion-marca.js'

export type FilaAsignacionMarca = Prisma.ProductoMarcaGetPayload<{}>

export function aAsignacionMarca(fila: FilaAsignacionMarca): AsignacionMarca {
  return new AsignacionMarca({
    id: fila.id, productoId: fila.productoId, marcaId: fila.marcaId,
    orden: ordenNullable(fila.orden),
    estado: fila.estado, fechas: { creadoEn: fila.creadoEn, actualizadoEn: fila.actualizadoEn },
  })
}
