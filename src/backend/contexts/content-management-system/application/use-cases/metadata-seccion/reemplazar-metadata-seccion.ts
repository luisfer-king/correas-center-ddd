import type { RepositorioMetadataSeccion } from '../../ports/repositorio-metadata-seccion.js'
import type { RepositorioContenidosSeccion } from '../../ports/repositorio-contenido-seccion.js'
import type { RepositorioTiposSeccion } from '../../ports/repositorio-tipo-seccion.js'
import type { AutorizacionCms, ContextoAccionCms } from '../../seguridad-cms.js'
import { permitirCms } from '../../seguridad-cms.js'
import type { RelojCms } from '../../operaciones-cms.js'
import { obtenerEditableCms, exigirVersionCms, contextoEscrituraCms } from '../../operaciones-cms.js'
import { metadataSeccion } from '../../../domain/metadata-seccion.js'

export class ReemplazarMetadataSeccion {
  constructor(private readonly repo: RepositorioMetadataSeccion, private readonly auth: AutorizacionCms,
    private readonly reloj: RelojCms, private readonly secciones: RepositorioContenidosSeccion,
    private readonly tipos: RepositorioTiposSeccion) {}
  async ejecutar(contexto: ContextoAccionCms, contenidoSeccionId: bigint, version: Date, metadata: unknown) {
    await permitirCms(this.auth, contexto.actorId, 'metadata_seccion', 'manage')
    const seccion = await obtenerEditableCms(this.secciones, contenidoSeccionId)
    exigirVersionCms(seccion.actualizadoEn, version)
    const tipo = await this.tipos.obtener(seccion.tipoSeccionId)
    if (!tipo || tipo.estado === 'eliminado' || (seccion.estado === 'activo' && tipo.estado !== 'activo')) throw new Error('Tipo de sección no disponible')
    const datos = tipo.validarMetadata(metadataSeccion(metadata))
    return this.repo.reemplazar(contenidoSeccionId, datos, version, contextoEscrituraCms(contexto, this.reloj, version))
  }
}
