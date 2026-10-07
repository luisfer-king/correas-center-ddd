import type { RepositorioMenus, ConsultaMenus } from '../../ports/repositorio-menu.js'
import type { AutorizacionCms } from '../../seguridad-cms.js'
import { permitirCms } from '../../seguridad-cms.js'
import { consultaCms } from '../../operaciones-cms.js'
import { idCMS } from '../../../domain/cms-values.js'
import { menuVisibleCms } from '../../proyeccion-menu.js'

export class ListarMenus {
  constructor(private readonly repo: RepositorioMenus, private readonly auth: AutorizacionCms) {}
  async ejecutar(actorId: string, consulta: ConsultaMenus = {}) {
    await permitirCms(this.auth, actorId, 'menus', 'read')
    if (consulta.empresaId !== undefined) idCMS(consulta.empresaId)
    const filtros = await consultaCms(this.auth, actorId, consulta)
    const filas = await this.repo.listar(filtros)
    return filas.map(menu => menuVisibleCms(menu, filtros.incluirEliminados === true))
  }
}
