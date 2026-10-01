import type { RepositorioTiposAtributo } from '../../ports/repositorio-tipos-atributo.js'
import type { TipoAtributo } from '../../../domain/tipo-atributo.js'
import { exigirLectura, puedeVerEliminados, type AutorizacionCatalogo } from '../../acceso-catalogo.js'
export class ListarTiposAtributo {
  constructor(private readonly repositorio: RepositorioTiposAtributo, private readonly autorizar: AutorizacionCatalogo) {}
  async ejecutar(actor: string, pagina = 1): Promise<readonly TipoAtributo[]> {
    await exigirLectura(this.autorizar, actor, 'tipos-atributo')
    return this.repositorio.listar(pagina, await puedeVerEliminados(this.autorizar, actor))
  }
}
