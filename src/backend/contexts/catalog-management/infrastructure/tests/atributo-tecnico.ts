import type { Prisma } from '../../../../generated/prisma/client.js'
import { Orden } from '../../../../shared/domain/value-objects.js'
import { AtributoTecnico } from '../../domain/atributo-tecnico.js'

export type FilaAtributoTecnico = Prisma.AtributoTecnicoGetPayload<{}>

export function aAtributoTecnico(fila: FilaAtributoTecnico): AtributoTecnico {
  return new AtributoTecnico({
    id: fila.id, tipoAtributoId: fila.tipoAtributoId, nombre: fila.nombre,
    valores: { descripcion: fila.descripcion, valorNumerico: fila.valorNumerico?.toString() ?? null,
      unidadMedida: fila.unidadMedida }, orden: Orden.create(fila.orden),
    estado: fila.estado, fechas: { creadoEn: fila.creadoEn, actualizadoEn: fila.actualizadoEn, eliminadoEn: fila.eliminadoEn },
  })
}
