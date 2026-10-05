import type { RepositorioRegistrosCMS, ConsultaRegistrosCMS } from '../../ports/repositorio-registro-cms.js'
import type { AutorizacionCms } from '../../seguridad-cms.js'
import { permitirCms } from '../../seguridad-cms.js'
import { consultaCms } from '../../operaciones-cms.js'

export class ListarRegistrosCMS {
  constructor(private readonly repo: RepositorioRegistrosCMS, private readonly auth: AutorizacionCms) {}
  async ejecutar(actorId: string, consulta: ConsultaRegistrosCMS = {}) {
    await permitirCms(this.auth, actorId, 'registros_cms', 'read')
    const filtros = await consultaCms(this.auth, actorId, consulta)
    return this.repo.listar(filtros)
  }
}
