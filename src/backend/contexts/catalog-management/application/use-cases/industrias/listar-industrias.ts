import type { RepositorioIndustrias } from '../../ports/repositorio-industrias.js'
import type { Industria } from '../../../domain/industria.js'
import { exigirLectura, puedeVerEliminados, type AutorizacionCatalogo } from '../../acceso-catalogo.js'
export class ListarIndustrias {
  constructor(private readonly repositorio: RepositorioIndustrias, private readonly autorizar: AutorizacionCatalogo) {}
  async ejecutar(actor: string, pagina = 1, empresaId?: bigint): Promise<readonly Industria[]> {
    await exigirLectura(this.autorizar, actor, 'industrias')
    return this.repositorio.listar(pagina, await puedeVerEliminados(this.autorizar, actor), empresaId)
  }
}
