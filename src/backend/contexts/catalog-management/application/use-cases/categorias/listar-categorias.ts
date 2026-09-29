import type { RepositorioCategorias } from '../../ports/repositorio-categorias.js'
import type { Categoria } from '../../../domain/categoria.js'
import { exigirLectura, puedeVerEliminados, type AutorizacionCatalogo } from '../../acceso-catalogo.js'
export class ListarCategorias {
  constructor(private readonly repositorio: RepositorioCategorias, private readonly autorizar: AutorizacionCatalogo) {}
  async ejecutar(actor: string, pagina = 1, productoId?: bigint): Promise<readonly Categoria[]> {
    await exigirLectura(this.autorizar, actor, 'categorias')
    return this.repositorio.listar(pagina, await puedeVerEliminados(this.autorizar, actor), productoId)
  }
}
