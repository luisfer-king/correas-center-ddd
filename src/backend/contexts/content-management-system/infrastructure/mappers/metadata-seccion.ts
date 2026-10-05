import { metadataSeccion } from '../../domain/metadata-seccion.js'
import type { MetadataSeccion } from '../../domain/metadata-seccion.js'

/** Convierte Prisma JsonValue (unknown en esta frontera) sin aserciones ni pérdidas de datos. */
export function mapearMetadataSeccion(valor: unknown): MetadataSeccion {
  return metadataSeccion(valor)
}
