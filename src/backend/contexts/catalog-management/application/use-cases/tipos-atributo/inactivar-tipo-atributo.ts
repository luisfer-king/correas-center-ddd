import type { RepositorioTiposAtributo } from '../../ports/repositorio-tipos-atributo.js'
import { exigirGestion, type AutorizacionCatalogo } from '../../acceso-catalogo.js'
import { fechaCambioCatalogo, type RelojCatalogo } from '../../fecha-cambio-catalogo.js'
export class InactivarTipoAtributo {
  constructor(private readonly repositorio: RepositorioTiposAtributo, private readonly autorizar: AutorizacionCatalogo, private readonly reloj: RelojCatalogo) {}
  async ejecutar(actor: string, id: bigint): Promise<void> {
    await exigirGestion(this.autorizar, actor, 'tipos-atributo')
    const registro = await this.repositorio.buscarPorId(id, false)
    if (!registro) throw new Error('Registro no disponible')
    const version = registro.actualizadoEn
    registro.inactivar(fechaCambioCatalogo(this.reloj, version))
    await this.repositorio.guardar(registro, version, actor)
  }
}
