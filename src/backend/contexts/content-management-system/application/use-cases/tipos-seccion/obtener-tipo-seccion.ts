import type { RepositorioTiposSeccion } from '../../ports/repositorio-tipo-seccion.js'
import type { AutorizacionCms } from '../../seguridad-cms.js'
import { permitirCms } from '../../seguridad-cms.js'
import { obtenerVisibleCms } from '../../operaciones-cms.js'

export class ObtenerTipoSeccion {
  constructor(private readonly repo: RepositorioTiposSeccion, private readonly auth: AutorizacionCms) {}
  async ejecutar(actorId: string, id: bigint) {
    await permitirCms(this.auth, actorId, 'tipos_seccion', 'read')
    return obtenerVisibleCms(this.repo, this.auth, actorId, id)
  }
}
