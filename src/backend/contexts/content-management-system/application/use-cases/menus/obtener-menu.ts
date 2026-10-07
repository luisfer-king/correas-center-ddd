import type { RepositorioMenus } from '../../ports/repositorio-menu.js'
import type { AutorizacionCms } from '../../seguridad-cms.js'
import { permitirCms, verEliminadosCms } from '../../seguridad-cms.js'
import { obtenerVisibleCms } from '../../operaciones-cms.js'
import { menuVisibleCms } from '../../proyeccion-menu.js'

export class ObtenerMenu {
  constructor(private readonly repo: RepositorioMenus, private readonly auth: AutorizacionCms) {}
  async ejecutar(actorId: string, id: bigint) {
    await permitirCms(this.auth, actorId, 'menus', 'read')
    const entidad = await obtenerVisibleCms(this.repo, this.auth, actorId, id)
    return menuVisibleCms(entidad, await verEliminadosCms(this.auth, actorId))
  }
}
