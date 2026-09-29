import type { RepositorioProductos } from '../../ports/repositorio-productos.js'
import type { Producto } from '../../../domain/producto.js'
import { exigirLectura, puedeVerEliminados, type AutorizacionCatalogo } from '../../acceso-catalogo.js'
export class ObtenerProducto {
  constructor(private readonly repositorio: RepositorioProductos, private readonly autorizar: AutorizacionCatalogo) {}
  async ejecutar(actor: string, id: bigint): Promise<Producto> {
    await exigirLectura(this.autorizar, actor, 'productos')
    const registro = await this.repositorio.buscarPorId(id, await puedeVerEliminados(this.autorizar, actor))
    if (!registro) throw new Error('Registro no disponible')
    return registro
  }
}
