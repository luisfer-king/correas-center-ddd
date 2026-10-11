import type { RepositorioPlantillasGama } from '../../ports/repositorio-plantillas-gama.js'
import { exigirLectura, type AutorizacionCatalogo } from '../../acceso-catalogo.js'
import { idGama } from '../../../domain/gama-values.js'

export class ObtenerPlantillaGama {
  constructor(private readonly repo:RepositorioPlantillasGama,private readonly autorizar:AutorizacionCatalogo) {}
  async ejecutar(actor:string,productoId:bigint) {
    await exigirLectura(this.autorizar,actor,'categorias')
    return this.repo.buscarPorProducto(idGama(productoId))
  }
}
