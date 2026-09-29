import type { RepositorioProductos } from '../../ports/repositorio-productos.js'
import type { Producto } from '../../../domain/producto.js'
import { exigirLectura, puedeVerEliminados, type AutorizacionCatalogo } from '../../acceso-catalogo.js'
export class ListarProductos {
  constructor(private readonly repositorio: RepositorioProductos, private readonly autorizar: AutorizacionCatalogo) {}
  async ejecutar(actor: string, pagina = 1, empresaId?: bigint): Promise<readonly Producto[]> {
    await exigirLectura(this.autorizar, actor, 'productos')
    return this.repositorio.listar(pagina, await puedeVerEliminados(this.autorizar, actor), empresaId)
  }
}
