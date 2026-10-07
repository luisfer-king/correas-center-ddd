import type { RepositorioPasosWizard, ConsultaPasosWizard } from '../../ports/repositorio-paso-wizard.js'
import type { AutorizacionCms } from '../../seguridad-cms.js'
import { permitirCms } from '../../seguridad-cms.js'
import { consultaCms } from '../../operaciones-cms.js'
import { idCMS } from '../../../domain/cms-values.js'

export class ListarPasosWizard {
  constructor(private readonly repo: RepositorioPasosWizard, private readonly auth: AutorizacionCms) {}
  async ejecutar(actorId: string, consulta: ConsultaPasosWizard = {}) {
    await permitirCms(this.auth, actorId, 'pasos_wizard', 'read')
    if (consulta.empresaId !== undefined) idCMS(consulta.empresaId)
    const filtros = await consultaCms(this.auth, actorId, consulta)
    return this.repo.listar(filtros)
  }
}
