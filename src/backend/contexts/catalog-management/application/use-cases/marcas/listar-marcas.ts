import type { RepositorioMarcas } from '../../ports/repositorio-marcas.js'
import type { Marca } from '../../../domain/marca.js'
import { exigirLectura, puedeVerEliminados, type AutorizacionCatalogo } from '../../acceso-catalogo.js'
export class ListarMarcas {
  constructor(private readonly repositorio: RepositorioMarcas, private readonly autorizar: AutorizacionCatalogo) {}
  async ejecutar(actor: string, pagina = 1): Promise<readonly Marca[]> {
    await exigirLectura(this.autorizar, actor, 'marcas')
    return this.repositorio.listar(pagina, await puedeVerEliminados(this.autorizar, actor))
  }
}
