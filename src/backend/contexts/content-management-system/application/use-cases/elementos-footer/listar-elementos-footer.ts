import type { RepositorioElementosFooter, ConsultaElementosFooter } from '../../ports/repositorio-footer-elemento.js'
import type { AutorizacionCms } from '../../seguridad-cms.js'
import { permitirCms } from '../../seguridad-cms.js'
import { consultaCms } from '../../operaciones-cms.js'
import { idCMS } from '../../../domain/cms-values.js'

export class ListarElementosFooter {
  constructor(private readonly repo: RepositorioElementosFooter, private readonly auth: AutorizacionCms) {}
  async ejecutar(actorId: string, consulta: ConsultaElementosFooter = {}) {
    await permitirCms(this.auth, actorId, 'elementos_footer', 'read')
    if (consulta.empresaId !== undefined) idCMS(consulta.empresaId)
    const filtros = await consultaCms(this.auth, actorId, consulta)
    return this.repo.listar(filtros)
  }
}
