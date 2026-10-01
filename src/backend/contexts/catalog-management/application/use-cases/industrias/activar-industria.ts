import type { RepositorioIndustrias } from '../../ports/repositorio-industrias.js'
import { exigirGestion, type AutorizacionCatalogo } from '../../acceso-catalogo.js'
import { fechaCambioCatalogo, type RelojCatalogo } from '../../fecha-cambio-catalogo.js'
export class ActivarIndustria {
  constructor(private readonly repositorio: RepositorioIndustrias, private readonly autorizar: AutorizacionCatalogo, private readonly reloj: RelojCatalogo) {}
  async ejecutar(actor: string, id: bigint): Promise<void> {
    await exigirGestion(this.autorizar, actor, 'industrias')
    const registro = await this.repositorio.buscarPorId(id, false)
    if (!registro) throw new Error('Registro no disponible')
    const version = registro.actualizadoEn
    registro.activar(fechaCambioCatalogo(this.reloj, version))
    await this.repositorio.guardar(registro, version, actor)
  }
}
