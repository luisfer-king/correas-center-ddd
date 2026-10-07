import type { RepositorioMenus } from '../../ports/repositorio-menu.js'
import type { AutorizacionCms, ContextoAccionCms } from '../../seguridad-cms.js'
import { permitirCms } from '../../seguridad-cms.js'
import type { RelojCms } from '../../operaciones-cms.js'
import { contextoEscrituraCms, exigirVersionCms, obtenerEditableCms } from '../../operaciones-cms.js'
import { booleanoCms } from '../../validaciones-cms.js'

export class FijarVisibilidadMenu {
  constructor(private readonly repo: RepositorioMenus, private readonly auth: AutorizacionCms, private readonly reloj: RelojCms) {}
  async ejecutar(contexto: ContextoAccionCms, id: bigint, version: Date, mostrar: boolean) {
    await permitirCms(this.auth, contexto.actorId, 'menus', 'manage')
    const entidad = await obtenerEditableCms(this.repo, id)
    exigirVersionCms(entidad.actualizadoEn, version)
    const escritura = contextoEscrituraCms(contexto, this.reloj, version)
    entidad.editar({ grupo: entidad.grupo, ruta: entidad.ruta, icono: entidad.icono, mostrar: booleanoCms(mostrar), cargarSubmenu: entidad.cargarSubmenu }, escritura.cuando)
    await this.repo.guardar(entidad, version, escritura)
    return entidad
  }
}
