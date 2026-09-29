import type { RepositorioAsignacionesIndustria } from '../../ports/repositorio-asignaciones-industria.js'
import type { AsignacionIndustria } from '../../../domain/asignacion-industria.js'
import { exigirLectura, puedeVerEliminados, type AutorizacionCatalogo } from '../../acceso-catalogo.js'
export class ListarAsignacionesIndustria {
  constructor(private readonly repositorio: RepositorioAsignacionesIndustria, private readonly autorizar: AutorizacionCatalogo) {}
  async ejecutar(actor: string, pagina = 1, industriaId: bigint): Promise<readonly AsignacionIndustria[]> {
    await exigirLectura(this.autorizar, actor, 'asignaciones-industria')
    return this.repositorio.listar(pagina, await puedeVerEliminados(this.autorizar, actor), industriaId)
  }
}
