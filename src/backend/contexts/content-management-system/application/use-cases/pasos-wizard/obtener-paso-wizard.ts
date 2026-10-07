import type { RepositorioPasosWizard } from '../../ports/repositorio-paso-wizard.js'
import type { AutorizacionCms } from '../../seguridad-cms.js'
import { permitirCms } from '../../seguridad-cms.js'
import { obtenerVisibleCms } from '../../operaciones-cms.js'

export class ObtenerPasoWizard {
  constructor(private readonly repo: RepositorioPasosWizard, private readonly auth: AutorizacionCms) {}
  async ejecutar(actorId: string, id: bigint) {
    await permitirCms(this.auth, actorId, 'pasos_wizard', 'read')
    return obtenerVisibleCms(this.repo, this.auth, actorId, id)
  }
}
