import type { RepositorioAsignacionesAtributo } from '../../ports/repositorio-asignaciones-atributo.js'
import { Orden } from '../../../../../shared/domain/value-objects.js'
import { exigirGestion, type AutorizacionCatalogo } from '../../acceso-catalogo.js'
import { fechaCambioCatalogo, type RelojCatalogo } from '../../fecha-cambio-catalogo.js'
export class EditarAsignacionAtributo {
  constructor(private readonly repositorio: RepositorioAsignacionesAtributo, private readonly autorizar: AutorizacionCatalogo, private readonly reloj: RelojCatalogo) {}
  async ejecutar(actor: string, id: bigint, datos: { valorPersonalizado: string | null; orden: number }) {
    await exigirGestion(this.autorizar, actor, 'asignaciones-atributo')
    const registro = await this.repositorio.buscarPorId(id, false)
    if (!registro) throw new Error('Asignación no disponible')
    const version = registro.actualizadoEn
    const fecha = fechaCambioCatalogo(this.reloj, version)
    registro.personalizar(datos.valorPersonalizado, fecha); registro.reordenar(Orden.create(datos.orden), fecha)
    await this.repositorio.guardar(registro, version, actor)
    return registro
  }
}
