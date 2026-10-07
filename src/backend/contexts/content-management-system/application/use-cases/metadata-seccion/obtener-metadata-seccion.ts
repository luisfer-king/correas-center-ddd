import type { RepositorioMetadataSeccion } from '../../ports/repositorio-metadata-seccion.js'
import type { RepositorioContenidosSeccion } from '../../ports/repositorio-contenido-seccion.js'
import type { AutorizacionCms } from '../../seguridad-cms.js'
import { permitirCms } from '../../seguridad-cms.js'
import { obtenerVisibleCms, exigirVersionCms } from '../../operaciones-cms.js'

export class ObtenerMetadataSeccion {
  constructor(private readonly repo: RepositorioMetadataSeccion, private readonly auth: AutorizacionCms,
    private readonly secciones: RepositorioContenidosSeccion) {}
  async ejecutar(actorId: string, contenidoSeccionId: bigint) {
    await permitirCms(this.auth, actorId, 'metadata_seccion', 'read')
    const seccion = await obtenerVisibleCms(this.secciones, this.auth, actorId, contenidoSeccionId)
    const resultado = await this.repo.obtener(contenidoSeccionId)
    if (!resultado) throw new Error('Metadata de sección no disponible')
    exigirVersionCms(resultado.actualizadoEn, seccion.actualizadoEn)
    if (resultado.empresaId !== seccion.empresaId || resultado.tipoSeccionId !== seccion.tipoSeccionId || resultado.contenidoSeccionId !== seccion.id) throw new Error('Metadata de otra sección')
    return resultado
  }
}
