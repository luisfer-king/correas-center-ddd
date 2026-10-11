import { valorAsignacion, type DatosValorAsignacion } from '../../valor-asignacion-aplicacion.js'
import type { RepositorioAsignacionesAtributo } from '../../ports/repositorio-asignaciones-atributo.js'
import { Orden } from '../../../../../shared/domain/value-objects.js'
import { exigirGestion, type AutorizacionCatalogo } from '../../acceso-catalogo.js'
import { fechaCambioCatalogo, type RelojCatalogo } from '../../fecha-cambio-catalogo.js'
export class EditarAsignacionAtributo {
  constructor(private readonly repositorio: RepositorioAsignacionesAtributo, private readonly autorizar: AutorizacionCatalogo, private readonly reloj: RelojCatalogo) {}
  async ejecutar(actor: string, id: bigint, datos: DatosValorAsignacion & { orden: number }) {
    await exigirGestion(this.autorizar, actor, 'asignaciones-atributo')
    const nuevo = valorAsignacion(datos), orden = Orden.create(datos.orden)
    const registro = await this.repositorio.buscarPorId(id, false)
    if (!registro) throw new Error('Asignación no disponible')
    const version = registro.actualizadoEn
    const fecha = fechaCambioCatalogo(this.reloj, version)
    if (nuevo.tipado) registro.personalizarValor(nuevo.valor, fecha)
    else registro.personalizar(datos.valorPersonalizado ?? null, fecha)
    registro.reordenar(orden, fecha)
    await this.repositorio.guardar(registro, version, actor)
    return registro
  }
}
