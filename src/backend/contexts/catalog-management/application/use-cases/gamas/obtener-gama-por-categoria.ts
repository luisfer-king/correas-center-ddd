import type { RepositorioGamas } from '../../ports/repositorio-gamas.js'
import { exigirLectura, puedeVerEliminados, type AutorizacionCatalogo } from '../../acceso-catalogo.js'
import { idGama } from '../../../domain/gama-values.js'
export class ObtenerGamaPorCategoria {
  constructor(private readonly repo:RepositorioGamas,private readonly autorizar:AutorizacionCatalogo) {}
  async ejecutar(actor:string,id:bigint) {
    await exigirLectura(this.autorizar,actor,'categorias')
    return this.repo.buscarPorCategoria(idGama(id),await puedeVerEliminados(this.autorizar,actor))
  }
}
