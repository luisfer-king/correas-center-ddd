import type { Prisma } from '../../../../generated/prisma/client.js'
import { Orden } from '../../../../shared/domain/value-objects.js'
import { AsignacionAtributo } from '../../domain/asignacion-atributo.js'

export type FilaAsignacionAtributo = Prisma.CategoriaAtributoGetPayload<{}>

export function aAsignacionAtributo(fila: FilaAsignacionAtributo): AsignacionAtributo {
  return new AsignacionAtributo({
    id: fila.id, categoriaId: fila.categoriaId, atributoId: fila.atributoId,
    valorPersonalizado: fila.valorPersonalizado?.toString() ?? null, orden: Orden.create(fila.orden),
    estado: fila.estado, fechas: { creadoEn: fila.creadoEn, actualizadoEn: fila.actualizadoEn },
  })
}
