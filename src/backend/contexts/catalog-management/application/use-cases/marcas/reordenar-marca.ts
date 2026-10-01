import type { RepositorioMarcas } from '../../ports/repositorio-marcas.js'
import { Orden } from '../../../../../shared/domain/value-objects.js'
import { exigirGestion, type AutorizacionCatalogo } from '../../acceso-catalogo.js'
import { fechaCambioCatalogo, type RelojCatalogo } from '../../fecha-cambio-catalogo.js'
export class ReordenarMarca {
  constructor(private readonly repositorio: RepositorioMarcas, private readonly autorizar: AutorizacionCatalogo, private readonly reloj: RelojCatalogo) {}
  async ejecutar(actor: string, id: bigint, orden: number) {
    await exigirGestion(this.autorizar, actor, 'marcas')
    const registro = await this.repositorio.buscarPorId(id, false)
    if (!registro) throw new Error('Registro no disponible')
    const version = registro.actualizadoEn
    registro.reordenar(Orden.create(orden), fechaCambioCatalogo(this.reloj, version))
    await this.repositorio.guardar(registro, version, actor)
    return registro
  }
}
