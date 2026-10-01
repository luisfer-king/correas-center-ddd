import type { RepositorioAsignacionesIndustria } from '../../ports/repositorio-asignaciones-industria.js'
import { Orden } from '../../../../../shared/domain/value-objects.js'
import { exigirGestion, type AutorizacionCatalogo } from '../../acceso-catalogo.js'
import { fechaCambioCatalogo, type RelojCatalogo } from '../../fecha-cambio-catalogo.js'
export class EditarAsignacionIndustria {
  constructor(private readonly repositorio: RepositorioAsignacionesIndustria, private readonly autorizar: AutorizacionCatalogo, private readonly reloj: RelojCatalogo) {}
  async ejecutar(actor: string, id: bigint, datos: { orden: number }) {
    await exigirGestion(this.autorizar, actor, 'asignaciones-industria')
    const registro = await this.repositorio.buscarPorId(id, false)
    if (!registro) throw new Error('Asignación no disponible')
    const version = registro.actualizadoEn
    const fecha = fechaCambioCatalogo(this.reloj, version)
    registro.reordenar(Orden.create(datos.orden), fecha)
    await this.repositorio.guardar(registro, version, actor)
    return registro
  }
}
