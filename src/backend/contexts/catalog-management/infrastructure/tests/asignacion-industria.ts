import type { Prisma } from '../../../../generated/prisma/client.js'
import { Orden } from '../../../../shared/domain/value-objects.js'
import type { DestinoIndustria } from '../../domain/asignacion-industria.js'
import { AsignacionIndustria } from '../../domain/asignacion-industria.js'

function tipoDestino(valor: string): DestinoIndustria['tipo'] {
  if (valor !== 'categoria' && valor !== 'servicio') throw new Error('Tipo de destino inválido')
  return valor
}

export type FilaAsignacionIndustria = Prisma.IndustriaAsignacionGetPayload<{}>

export function aAsignacionIndustria(fila: FilaAsignacionIndustria): AsignacionIndustria {
  return new AsignacionIndustria({
    id: fila.id, industriaId: fila.industriaId, destino: {
      tipo: tipoDestino(fila.tipoRegistro), id: fila.registroId,
    }, orden: Orden.create(fila.orden),
    estado: fila.estado, fechas: { creadoEn: fila.creadoEn, actualizadoEn: fila.actualizadoEn },
  })
}
