import type { RepositorioTiposAtributo } from '../../ports/repositorio-tipos-atributo.js'
import { exigirGestion, type AutorizacionCatalogo } from '../../acceso-catalogo.js'
import { fechaCambioCatalogo, type RelojCatalogo } from '../../fecha-cambio-catalogo.js'
export class EditarTipoAtributo {
  constructor(private readonly repositorio: RepositorioTiposAtributo, private readonly autorizar: AutorizacionCatalogo, private readonly reloj: RelojCatalogo) {}
  async ejecutar(actor: string, id: bigint, datos: { nombre: string; descripcion: string | null; icono: string | null; capacidades: { descripcion: boolean; numero: boolean; unidad: boolean } }) {
    await exigirGestion(this.autorizar, actor, 'tipos-atributo')
    const registro = await this.repositorio.buscarPorId(id, false)
    if (!registro) throw new Error('Registro no disponible')
    const version = registro.actualizadoEn
    registro.editar(datos, fechaCambioCatalogo(this.reloj, version))
    await this.repositorio.guardar(registro, version, actor)
    return registro
  }
}
