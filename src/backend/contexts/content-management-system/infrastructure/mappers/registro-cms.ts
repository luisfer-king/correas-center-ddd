import { RegistroCMS } from '../../domain/registro-cms.js'
import { Orden } from '../../../../shared/domain/value-objects.js'
import type { EstadoCMS } from '../../domain/cms-values.js'

/** Campos escalares del modelo Prisma RegistroCMS; no requiere cliente ni conexión. */
export type FilaRegistroCMS = Readonly<{
  id: bigint
  identificador: string
  nombre: string
  descripcion: string | null
  orden: number
  estado: EstadoCMS
  eliminadoEn: Date | null
  creadoEn: Date
  actualizadoEn: Date
}>

export function mapearRegistroCMS(fila: FilaRegistroCMS): RegistroCMS {
  return new RegistroCMS({
    id: fila.id,
    identificador: fila.identificador,
    nombre: fila.nombre,
    descripcion: fila.descripcion,
    orden: Orden.create(fila.orden),
    estado: fila.estado,
    fechas: { creadoEn: fila.creadoEn, actualizadoEn: fila.actualizadoEn, eliminadoEn: fila.eliminadoEn },
  })
}
