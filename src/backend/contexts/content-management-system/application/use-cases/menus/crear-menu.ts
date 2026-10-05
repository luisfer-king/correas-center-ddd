import type { RepositorioMenus } from '../../ports/repositorio-menu.js'
import type { AutorizacionCms, ContextoAccionCms } from '../../seguridad-cms.js'
import { permitirCms } from '../../seguridad-cms.js'
import type { RelojCms } from '../../operaciones-cms.js'
import { contextoEscrituraCms } from '../../operaciones-cms.js'
import { normalizarCrearMenu } from './datos-menu.js'
import type { DatosCrearMenu } from './datos-menu.js'

export class CrearMenu {
  constructor(private readonly repo: RepositorioMenus, private readonly auth: AutorizacionCms, private readonly reloj: RelojCms) {}
  async ejecutar(contexto: ContextoAccionCms, entrada: DatosCrearMenu) {
    await permitirCms(this.auth, contexto.actorId, 'menus', 'manage')
    const datos = normalizarCrearMenu(entrada)
    const escritura = contextoEscrituraCms(contexto, this.reloj)
    return this.repo.crear(datos, escritura)
  }
}
