import type { RepositorioItemsMenu, ConsultaItemsMenu } from '../../ports/repositorio-menu-item.js'
import type { AutorizacionCms } from '../../seguridad-cms.js'
import { permitirCms } from '../../seguridad-cms.js'
import { consultaCms } from '../../operaciones-cms.js'
import { idCMS } from '../../../domain/cms-values.js'

export class ListarItemsMenu {
  constructor(private readonly repo: RepositorioItemsMenu, private readonly auth: AutorizacionCms) {}
  async ejecutar(actorId: string, consulta: ConsultaItemsMenu = {}) {
    await permitirCms(this.auth, actorId, 'items_menu', 'read')
    if (consulta.menuId !== undefined) idCMS(consulta.menuId)
    const filtros = await consultaCms(this.auth, actorId, consulta)
    return this.repo.listar(filtros)
  }
}
