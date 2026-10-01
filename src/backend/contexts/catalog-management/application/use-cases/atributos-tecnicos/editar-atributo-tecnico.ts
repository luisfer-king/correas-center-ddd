import type { RepositorioAtributosTecnicos } from '../../ports/repositorio-atributos-tecnicos.js'
import { exigirGestion, type AutorizacionCatalogo } from '../../acceso-catalogo.js'
import { fechaCambioCatalogo, type RelojCatalogo } from '../../fecha-cambio-catalogo.js'
export class EditarAtributoTecnico {
  constructor(private readonly repositorio: RepositorioAtributosTecnicos, private readonly autorizar: AutorizacionCatalogo, private readonly reloj: RelojCatalogo) {}
  async ejecutar(actor: string, id: bigint, datos: { nombre: string; valores: { descripcion: string | null; valorNumerico: string | null; unidadMedida: string | null } }) {
    await exigirGestion(this.autorizar, actor, 'atributos-tecnicos')
    const registro = await this.repositorio.buscarPorId(id, false)
    if (!registro) throw new Error('Registro no disponible')
    const version = registro.actualizadoEn
    registro.editar(datos.nombre, datos.valores, fechaCambioCatalogo(this.reloj, version))
    await this.repositorio.guardar(registro, version, actor)
    return registro
  }
}
