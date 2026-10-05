import type { RepositorioRegistrosCMS } from '../../ports/repositorio-registro-cms.js'
import type { AutorizacionCms } from '../../seguridad-cms.js'
import { permitirCms } from '../../seguridad-cms.js'
import { obtenerVisibleCms } from '../../operaciones-cms.js'

export class ObtenerRegistroCMS {
  constructor(private readonly repo: RepositorioRegistrosCMS, private readonly auth: AutorizacionCms) {}
  async ejecutar(actorId: string, id: bigint) {
    await permitirCms(this.auth, actorId, 'registros_cms', 'read')
    return obtenerVisibleCms(this.repo, this.auth, actorId, id)
  }
}
