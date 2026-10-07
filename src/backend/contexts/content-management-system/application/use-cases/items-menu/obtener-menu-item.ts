import type { RepositorioItemsMenu } from '../../ports/repositorio-menu-item.js'
import type { AutorizacionCms } from '../../seguridad-cms.js'
import { permitirCms } from '../../seguridad-cms.js'
import { obtenerVisibleCms } from '../../operaciones-cms.js'

export class ObtenerMenuItem {
  constructor(private readonly repo: RepositorioItemsMenu, private readonly auth: AutorizacionCms) {}
  async ejecutar(actorId: string, id: bigint) {
    await permitirCms(this.auth, actorId, 'items_menu', 'read')
    return obtenerVisibleCms(this.repo, this.auth, actorId, id)
  }
}
