import type { RepositorioElementosFooter } from '../../ports/repositorio-footer-elemento.js'
import type { AutorizacionCms } from '../../seguridad-cms.js'
import { permitirCms } from '../../seguridad-cms.js'
import { obtenerVisibleCms } from '../../operaciones-cms.js'

export class ObtenerFooterElemento {
  constructor(private readonly repo: RepositorioElementosFooter, private readonly auth: AutorizacionCms) {}
  async ejecutar(actorId: string, id: bigint) {
    await permitirCms(this.auth, actorId, 'elementos_footer', 'read')
    return obtenerVisibleCms(this.repo, this.auth, actorId, id)
  }
}
