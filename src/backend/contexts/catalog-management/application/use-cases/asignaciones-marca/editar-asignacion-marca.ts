import type { RepositorioAsignacionesMarca } from '../../ports/repositorio-asignaciones-marca.js'
import { Orden } from '../../../../../shared/domain/value-objects.js'
import { exigirGestion, type AutorizacionCatalogo } from '../../acceso-catalogo.js'
import { fechaCambioCatalogo, type RelojCatalogo } from '../../fecha-cambio-catalogo.js'
export class EditarAsignacionMarca {
  constructor(private readonly repositorio: RepositorioAsignacionesMarca, private readonly autorizar: AutorizacionCatalogo, private readonly reloj: RelojCatalogo) {}
  async ejecutar(actor: string, id: bigint, datos: { orden: number | null }) {
    await exigirGestion(this.autorizar, actor, 'asignaciones-marca')
    const registro = await this.repositorio.buscarPorId(id, false)
    if (!registro) throw new Error('Asignación no disponible')
    const version = registro.actualizadoEn
    const fecha = fechaCambioCatalogo(this.reloj, version)
    registro.reordenar(datos.orden === null ? null : Orden.create(datos.orden), fecha)
    await this.repositorio.guardar(registro, version, actor)
    return registro
  }
}
