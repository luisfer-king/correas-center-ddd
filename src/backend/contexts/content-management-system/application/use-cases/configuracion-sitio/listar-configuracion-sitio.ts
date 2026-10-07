import type { RepositorioConfiguracionesSitio, ConsultaConfiguracionesSitio } from '../../ports/repositorio-configuracion-sitio.js'
import type { AutorizacionCms } from '../../seguridad-cms.js'
import { permitirCms } from '../../seguridad-cms.js'
import { consultaCms } from '../../operaciones-cms.js'
import { idCMS } from '../../../domain/cms-values.js'

export class ListarConfiguracionesSitio {
  constructor(private readonly repo: RepositorioConfiguracionesSitio, private readonly auth: AutorizacionCms) {}
  async ejecutar(actorId: string, consulta: ConsultaConfiguracionesSitio = {}) {
    await permitirCms(this.auth, actorId, 'configuracion_sitio', 'read')
    if (consulta.empresaId !== undefined && consulta.empresaId !== null) idCMS(consulta.empresaId)
    if (consulta.activo !== undefined && consulta.activo !== null && typeof consulta.activo !== 'boolean') throw new Error('Indicador inválido')
    for (const valor of [consulta.clave, consulta.grupo]) if (valor !== undefined && typeof valor !== 'string') throw new Error('Filtro inválido')
    const filtros = await consultaCms(this.auth, actorId, consulta)
    return this.repo.listar(filtros)
  }
}
