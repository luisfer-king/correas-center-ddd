import type { RepositorioAtributosTecnicos } from '../../ports/repositorio-atributos-tecnicos.js'
import type { AtributoTecnico } from '../../../domain/atributo-tecnico.js'
import { exigirLectura, puedeVerEliminados, type AutorizacionCatalogo } from '../../acceso-catalogo.js'
export class ObtenerAtributoTecnico {
  constructor(private readonly repositorio: RepositorioAtributosTecnicos, private readonly autorizar: AutorizacionCatalogo) {}
  async ejecutar(actor: string, id: bigint): Promise<AtributoTecnico> {
    await exigirLectura(this.autorizar, actor, 'atributos-tecnicos')
    const registro = await this.repositorio.buscarPorId(id, await puedeVerEliminados(this.autorizar, actor))
    if (!registro) throw new Error('Registro no disponible')
    return registro
  }
}
