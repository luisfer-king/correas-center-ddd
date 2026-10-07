import type { MetadataSeccion } from '../../domain/metadata-seccion.js'
import type { ContenidoSeccion } from '../../domain/contenido-seccion.js'
import type { EscrituraContenidoSeccion } from './repositorio-contenido-seccion.js'

/** Proyección del JSON de una sección; no representa una tabla o entidad independiente. */
export type MetadataPersistidaSeccion = Readonly<{
  contenidoSeccionId: bigint
  empresaId: bigint
  tipoSeccionId: bigint
  metadata: MetadataSeccion
  actualizadoEn: Date
}>

/** Reemplazar comparte versión y transacción con ContenidoSeccion; validar contra TipoSeccion. */
export interface RepositorioMetadataSeccion {
  obtener(contenidoSeccionId: bigint): Promise<MetadataPersistidaSeccion | null>
  reemplazar(contenidoSeccionId: bigint, metadata: MetadataSeccion, actualizadoEnAnterior: Date,
    contexto: EscrituraContenidoSeccion): Promise<ContenidoSeccion>
}
