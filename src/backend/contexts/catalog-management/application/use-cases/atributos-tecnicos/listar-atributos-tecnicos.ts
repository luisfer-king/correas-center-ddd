import type { RepositorioAtributosTecnicos } from '../../ports/repositorio-atributos-tecnicos.js'
import type { AtributoTecnico } from '../../../domain/atributo-tecnico.js'
import { exigirLectura, puedeVerEliminados, type AutorizacionCatalogo } from '../../acceso-catalogo.js'
export class ListarAtributosTecnicos {
  constructor(private readonly repositorio: RepositorioAtributosTecnicos, private readonly autorizar: AutorizacionCatalogo) {}
  async ejecutar(actor: string, pagina = 1, tipoAtributoId?: bigint): Promise<readonly AtributoTecnico[]> {
    await exigirLectura(this.autorizar, actor, 'atributos-tecnicos')
    return this.repositorio.listar(pagina, await puedeVerEliminados(this.autorizar, actor), tipoAtributoId)
  }
}
