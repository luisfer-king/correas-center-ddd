import type { RepositorioConfiguracionesSitio } from '../../ports/repositorio-configuracion-sitio.js'
import type { AutorizacionCms } from '../../seguridad-cms.js'
import { permitirCms } from '../../seguridad-cms.js'
import { idConfiguracionCms } from '../../operaciones-cms.js'

export class ObtenerConfiguracionSitio {
  constructor(private readonly repo: RepositorioConfiguracionesSitio, private readonly auth: AutorizacionCms) {}
  async ejecutar(actorId: string, id: number) {
    await permitirCms(this.auth, actorId, 'configuracion_sitio', 'read')
    const entidad = await this.repo.obtener(idConfiguracionCms(id))
    if (!entidad) throw new Error('Configuración no disponible')
    return entidad
  }
}
