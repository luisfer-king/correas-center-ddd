import type { RepositorioMenus } from '../../ports/repositorio-menu.js'
import type { AutorizacionCms, ContextoAccionCms } from '../../seguridad-cms.js'
import { permitirCms } from '../../seguridad-cms.js'
import type { RelojCms } from '../../operaciones-cms.js'
import { contextoEscrituraCms, exigirVersionCms, obtenerEditableCms } from '../../operaciones-cms.js'
import { normalizarEditarMenu } from './datos-menu.js'
import type { DatosEditarMenu } from './datos-menu.js'

export class EditarMenu {
  constructor(private readonly repo: RepositorioMenus, private readonly auth: AutorizacionCms, private readonly reloj: RelojCms) {}
  async ejecutar(contexto: ContextoAccionCms, id: bigint, version: Date, entrada: DatosEditarMenu) {
    await permitirCms(this.auth, contexto.actorId, 'menus', 'manage')
    const entidad = await obtenerEditableCms(this.repo, id)
    exigirVersionCms(entidad.actualizadoEn, version)
    const datos = normalizarEditarMenu(entrada)
    const escritura = contextoEscrituraCms(contexto, this.reloj, version)
    entidad.editar(datos, escritura.cuando)
    await this.repo.guardar(entidad, version, escritura)
    return entidad
  }
}
