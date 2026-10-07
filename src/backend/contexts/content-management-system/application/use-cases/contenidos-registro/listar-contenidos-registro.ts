import type { RepositorioContenidosRegistro, ConsultaContenidosRegistro } from '../../ports/repositorio-contenido-registro.js'
import type { AutorizacionCms } from '../../seguridad-cms.js'
import { permitirCms } from '../../seguridad-cms.js'
import { consultaCms } from '../../operaciones-cms.js'
import { idCMS } from '../../../domain/cms-values.js'

export class ListarContenidosRegistro {
  constructor(private readonly repo: RepositorioContenidosRegistro, private readonly auth: AutorizacionCms) {}
  async ejecutar(actorId: string, consulta: ConsultaContenidosRegistro = {}) {
    await permitirCms(this.auth, actorId, 'contenidos_registro', 'read')
    if (consulta.empresaId !== undefined) idCMS(consulta.empresaId)
    if (consulta.registroId !== undefined) idCMS(consulta.registroId)
    const filtros = await consultaCms(this.auth, actorId, consulta)
    return this.repo.listar(filtros)
  }
}
