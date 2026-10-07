import type { RepositorioItemsMenu } from '../../ports/repositorio-menu-item.js'
import type { AutorizacionCms, ContextoAccionCms } from '../../seguridad-cms.js'
import { permitirCms } from '../../seguridad-cms.js'
import type { RelojCms } from '../../operaciones-cms.js'
import { contextoEscrituraCms, exigirVersionCms, obtenerEditableCms } from '../../operaciones-cms.js'
import type { RepositorioMenus } from '../../ports/repositorio-menu.js'

export class InactivarMenuItem {
  constructor(private readonly repo: RepositorioItemsMenu, private readonly auth: AutorizacionCms, private readonly reloj: RelojCms, private readonly menus: RepositorioMenus) {}
  async ejecutar(contexto: ContextoAccionCms, id: bigint, version: Date) {
    await permitirCms(this.auth, contexto.actorId, 'items_menu', 'manage')
    const entidad = await obtenerEditableCms(this.repo, id)
    exigirVersionCms(entidad.actualizadoEn, version)
    const menu = await this.menus.obtener(entidad.menuId)
    if (!menu || menu.estado === 'eliminado') throw new Error('Menú no disponible')
    const escritura = contextoEscrituraCms(contexto, this.reloj, version, menu.actualizadoEn)
    entidad.inactivar(escritura.cuando)
    await this.repo.guardar(entidad, version, escritura)
    return entidad
  }
}
