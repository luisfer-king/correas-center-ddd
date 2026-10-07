import type { RepositorioContenidosSeccion, ConsultaContenidosSeccion } from '../../ports/repositorio-contenido-seccion.js'
import type { AutorizacionCms } from '../../seguridad-cms.js'
import { permitirCms } from '../../seguridad-cms.js'
import { consultaCms } from '../../operaciones-cms.js'
import { idCMS } from '../../../domain/cms-values.js'

export class ListarContenidosSeccion {
  constructor(private readonly repo: RepositorioContenidosSeccion, private readonly auth: AutorizacionCms) {}
  async ejecutar(actorId: string, consulta: ConsultaContenidosSeccion = {}) {
    await permitirCms(this.auth, actorId, 'contenidos_seccion', 'read')
    if (consulta.empresaId !== undefined) idCMS(consulta.empresaId)
    if (consulta.tipoSeccionId !== undefined) idCMS(consulta.tipoSeccionId)
    const filtros = await consultaCms(this.auth, actorId, consulta)
    return this.repo.listar(filtros)
  }
}
