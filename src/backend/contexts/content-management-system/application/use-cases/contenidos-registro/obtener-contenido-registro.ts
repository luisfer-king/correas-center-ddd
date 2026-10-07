import type { RepositorioContenidosRegistro } from '../../ports/repositorio-contenido-registro.js'
import type { AutorizacionCms } from '../../seguridad-cms.js'
import { permitirCms } from '../../seguridad-cms.js'
import { obtenerVisibleCms } from '../../operaciones-cms.js'

export class ObtenerContenidoRegistro {
  constructor(private readonly repo: RepositorioContenidosRegistro, private readonly auth: AutorizacionCms) {}
  async ejecutar(actorId: string, id: bigint) {
    await permitirCms(this.auth, actorId, 'contenidos_registro', 'read')
    return obtenerVisibleCms(this.repo, this.auth, actorId, id)
  }
}
