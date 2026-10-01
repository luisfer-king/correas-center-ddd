import type { RepositorioIndustrias } from '../../ports/repositorio-industrias.js'
import { exigirGestion, type AutorizacionCatalogo } from '../../acceso-catalogo.js'
import { fechaCambioCatalogo, type RelojCatalogo } from '../../fecha-cambio-catalogo.js'
export class EditarIndustria {
  constructor(private readonly repositorio: RepositorioIndustrias, private readonly autorizar: AutorizacionCatalogo, private readonly reloj: RelojCatalogo) {}
  async ejecutar(actor: string, id: bigint, datos: { nombre: string; imagen: string | null }) {
    await exigirGestion(this.autorizar, actor, 'industrias')
    const registro = await this.repositorio.buscarPorId(id, false)
    if (!registro) throw new Error('Registro no disponible')
    const version = registro.actualizadoEn
    registro.editar(datos.nombre, datos.imagen, fechaCambioCatalogo(this.reloj, version))
    await this.repositorio.guardar(registro, version, actor)
    return registro
  }
}
