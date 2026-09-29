import type { RepositorioTiposAtributo } from '../../ports/repositorio-tipos-atributo.js'
import type { TipoAtributo } from '../../../domain/tipo-atributo.js'
import { exigirLectura, puedeVerEliminados, type AutorizacionCatalogo } from '../../acceso-catalogo.js'
export class ObtenerTipoAtributo {
  constructor(private readonly repositorio: RepositorioTiposAtributo, private readonly autorizar: AutorizacionCatalogo) {}
  async ejecutar(actor: string, id: bigint): Promise<TipoAtributo> {
    await exigirLectura(this.autorizar, actor, 'tipos-atributo')
    const registro = await this.repositorio.buscarPorId(id, await puedeVerEliminados(this.autorizar, actor))
    if (!registro) throw new Error('Registro no disponible')
    return registro
  }
}
