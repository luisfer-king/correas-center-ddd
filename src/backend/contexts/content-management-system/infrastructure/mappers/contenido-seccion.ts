import { ContenidoSeccion } from '../../domain/contenido-seccion.js'
import { Orden } from '../../../../shared/domain/value-objects.js'
import type { EstadoCMS } from '../../domain/cms-values.js'
import { mapearMetadataSeccion } from './metadata-seccion.js'

/** Campos escalares del modelo Prisma ContenidoSeccion; no requiere cliente ni conexión. */
export type FilaContenidoSeccion = Readonly<{
  id: bigint
  empresaId: bigint
  tipoSeccionId: bigint
  titulo: string | null
  subtitulo: string | null
  descripcion: string | null
  icono: string | null
  imagen: string | null
  metadata: unknown
  orden: number
  mostrar: boolean
  estado: EstadoCMS
  eliminadoEn: Date | null
  creadoEn: Date
  actualizadoEn: Date
}>

export function mapearContenidoSeccion(fila: FilaContenidoSeccion): ContenidoSeccion {
  return new ContenidoSeccion({
    id: fila.id,
    empresaId: fila.empresaId,
    tipoSeccionId: fila.tipoSeccionId,
    metadata: mapearMetadataSeccion(fila.metadata),
    orden: Orden.create(fila.orden),
    mostrar: fila.mostrar,
    estado: fila.estado,
    fechas: { creadoEn: fila.creadoEn, actualizadoEn: fila.actualizadoEn, eliminadoEn: fila.eliminadoEn },
    campos: { titulo: fila.titulo, subtitulo: fila.subtitulo, descripcion: fila.descripcion, icono: fila.icono, imagen: fila.imagen },
  })
}
