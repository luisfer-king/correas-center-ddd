import type { RepositorioServicios } from '../../ports/repositorio-servicios.js'
import { Orden } from '../../../../../shared/domain/value-objects.js'
import { exigirGestion, type AutorizacionCatalogo } from '../../acceso-catalogo.js'
import { fechaCambioCatalogo, type RelojCatalogo } from '../../fecha-cambio-catalogo.js'
export class ReordenarServicio {
  constructor(private readonly repositorio: RepositorioServicios, private readonly autorizar: AutorizacionCatalogo, private readonly reloj: RelojCatalogo) {}
  async ejecutar(actor: string, id: bigint, orden: number) {
    await exigirGestion(this.autorizar, actor, 'servicios')
    const registro = await this.repositorio.buscarPorId(id, false)
    if (!registro) throw new Error('Registro no disponible')
    const version = registro.actualizadoEn
    registro.reordenar(Orden.create(orden), fechaCambioCatalogo(this.reloj, version))
    await this.repositorio.guardar(registro, version, actor)
    return registro
  }
}
