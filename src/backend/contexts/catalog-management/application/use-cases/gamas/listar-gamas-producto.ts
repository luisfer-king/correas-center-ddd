import type { RepositorioGamas } from '../../ports/repositorio-gamas.js'
import { exigirLectura, puedeVerEliminados, type AutorizacionCatalogo } from '../../acceso-catalogo.js'
import { idGama } from '../../../domain/gama-values.js'
export class ListarGamasProducto {
  constructor(private readonly repo:RepositorioGamas,private readonly autorizar:AutorizacionCatalogo) {}
  async ejecutar(actor:string,productoId:bigint,pagina=1) {
    await exigirLectura(this.autorizar,actor,'categorias')
    if (!Number.isSafeInteger(pagina) || pagina<1 || pagina>10000) throw new Error('Página inválida')
    return this.repo.listarPorProducto(idGama(productoId),pagina,await puedeVerEliminados(this.autorizar,actor))
  }
}
