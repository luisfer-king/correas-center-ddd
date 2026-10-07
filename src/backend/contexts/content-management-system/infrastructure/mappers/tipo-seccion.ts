import { TipoSeccion } from '../../domain/tipo-seccion.js'
import { Orden, Slug } from '../../../../shared/domain/value-objects.js'
import type { EstadoCMS } from '../../domain/cms-values.js'
import { camposMetadata } from '../../domain/metadata-seccion.js'

/** Campos escalares del modelo Prisma TipoSeccion; no requiere cliente ni conexión. */
export type FilaTipoSeccion = Readonly<{
  id: bigint
  nombre: string
  slug: string
  descripcion: string | null
  camposMetadata: unknown
  icono: string | null
  orden: number
  estado: EstadoCMS
  eliminadoEn: Date | null
  creadoEn: Date
  actualizadoEn: Date
}>

export function mapearTipoSeccion(fila: FilaTipoSeccion): TipoSeccion {
  return new TipoSeccion({
    id: fila.id,
    nombre: fila.nombre,
    slug: Slug.create(fila.slug),
    descripcion: fila.descripcion,
    camposMetadata: camposMetadata(fila.camposMetadata),
    icono: fila.icono,
    orden: Orden.create(fila.orden),
    estado: fila.estado,
    fechas: { creadoEn: fila.creadoEn, actualizadoEn: fila.actualizadoEn, eliminadoEn: fila.eliminadoEn },
  })
}
