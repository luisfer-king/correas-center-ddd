import type { Prisma } from '../../../../generated/prisma/client.js'
import { Slug, Orden } from '../../../../shared/domain/value-objects.js'
import { TipoAtributo } from '../../domain/tipo-atributo.js'

export type FilaTipoAtributo = Prisma.TipoAtributoGetPayload<{}>

export function aTipoAtributo(fila: FilaTipoAtributo): TipoAtributo {
  return new TipoAtributo({
    id: fila.id, nombre: fila.nombre, slug: Slug.create(fila.slug), descripcion: fila.descripcion,
    icono: fila.icono, orden: Orden.create(fila.orden), capacidades: {
      descripcion: fila.permiteDescripcion, numero: fila.permiteValorNumerico,
      unidad: fila.permiteUnidadMedida,
    },
    estado: fila.estado, fechas: { creadoEn: fila.creadoEn, actualizadoEn: fila.actualizadoEn, eliminadoEn: fila.eliminadoEn },
  })
}
