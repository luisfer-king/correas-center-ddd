import type { RepositorioItemsMenu } from '../../ports/repositorio-menu-item.js'
import type { AutorizacionCms, ContextoAccionCms } from '../../seguridad-cms.js'
import { permitirCms } from '../../seguridad-cms.js'
import type { RelojCms } from '../../operaciones-cms.js'
import { contextoEscrituraCms } from '../../operaciones-cms.js'
import type { RepositorioMenus } from '../../ports/repositorio-menu.js'
import { normalizarCrearMenuItem } from './datos-menu-item.js'
import type { DatosCrearMenuItem } from './datos-menu-item.js'

export class CrearMenuItem {
  constructor(private readonly repo: RepositorioItemsMenu, private readonly auth: AutorizacionCms, private readonly reloj: RelojCms, private readonly menus: RepositorioMenus) {}
  async ejecutar(contexto: ContextoAccionCms, entrada: DatosCrearMenuItem) {
    await permitirCms(this.auth, contexto.actorId, 'items_menu', 'manage')
    const datos = normalizarCrearMenuItem(entrada)
    const menu = await this.menus.obtener(datos.menuId)
    if (!menu || menu.estado !== 'activo') throw new Error('Menú no disponible')
    const escritura = contextoEscrituraCms(contexto, this.reloj, menu.actualizadoEn)
    return this.repo.crear(datos, escritura)
  }
}
