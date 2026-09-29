import type { RepositorioCategorias } from '../../ports/repositorio-categorias.js'
import { exigirGestion, type AutorizacionCatalogo } from '../../acceso-catalogo.js'
import { fechaCambioCatalogo, type RelojCatalogo } from '../../fecha-cambio-catalogo.js'
export class EditarCategoria {
  constructor(private readonly repositorio: RepositorioCategorias, private readonly autorizar: AutorizacionCatalogo, private readonly reloj: RelojCatalogo) {}
  async ejecutar(actor: string, id: bigint, datos: { nombre: string; imagen: string | null; descripcion: string | null; descripcionCorta: string | null; uso: string | null }) {
    await exigirGestion(this.autorizar, actor, 'categorias')
    const registro = await this.repositorio.buscarPorId(id, false)
    if (!registro) throw new Error('Registro no disponible')
    const version = registro.actualizadoEn
    registro.editar(datos, fechaCambioCatalogo(this.reloj, version))
    await this.repositorio.guardar(registro, version, actor)
    return registro
  }
}
