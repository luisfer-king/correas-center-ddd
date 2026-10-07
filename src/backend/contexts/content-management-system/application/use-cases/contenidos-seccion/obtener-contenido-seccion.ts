import type { RepositorioContenidosSeccion } from '../../ports/repositorio-contenido-seccion.js'
import type { AutorizacionCms } from '../../seguridad-cms.js'
import { permitirCms } from '../../seguridad-cms.js'
import { obtenerVisibleCms } from '../../operaciones-cms.js'

export class ObtenerContenidoSeccion {
  constructor(private readonly repo: RepositorioContenidosSeccion, private readonly auth: AutorizacionCms) {}
  async ejecutar(actorId: string, id: bigint) {
    await permitirCms(this.auth, actorId, 'contenidos_seccion', 'read')
    return obtenerVisibleCms(this.repo, this.auth, actorId, id)
  }
}
