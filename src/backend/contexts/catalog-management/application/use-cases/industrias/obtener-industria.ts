import type { RepositorioIndustrias } from '../../ports/repositorio-industrias.js'
import type { Industria } from '../../../domain/industria.js'
import { exigirLectura, puedeVerEliminados, type AutorizacionCatalogo } from '../../acceso-catalogo.js'
export class ObtenerIndustria {
  constructor(private readonly repositorio: RepositorioIndustrias, private readonly autorizar: AutorizacionCatalogo) {}
  async ejecutar(actor: string, id: bigint): Promise<Industria> {
    await exigirLectura(this.autorizar, actor, 'industrias')
    const registro = await this.repositorio.buscarPorId(id, await puedeVerEliminados(this.autorizar, actor))
    if (!registro) throw new Error('Registro no disponible')
    return registro
  }
}
