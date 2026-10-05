import type { RepositorioTiposSeccion, ConsultaTiposSeccion } from '../../ports/repositorio-tipo-seccion.js'
import type { AutorizacionCms } from '../../seguridad-cms.js'
import { permitirCms } from '../../seguridad-cms.js'
import { consultaCms } from '../../operaciones-cms.js'

export class ListarTiposSeccion {
  constructor(private readonly repo: RepositorioTiposSeccion, private readonly auth: AutorizacionCms) {}
  async ejecutar(actorId: string, consulta: ConsultaTiposSeccion = {}) {
    await permitirCms(this.auth, actorId, 'tipos_seccion', 'read')
    const filtros = await consultaCms(this.auth, actorId, consulta)
    return this.repo.listar(filtros)
  }
}
