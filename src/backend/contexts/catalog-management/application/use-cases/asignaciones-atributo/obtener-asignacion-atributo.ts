import type { RepositorioAsignacionesAtributo } from '../../ports/repositorio-asignaciones-atributo.js'
import type { AsignacionAtributo } from '../../../domain/asignacion-atributo.js'
import { exigirLectura, puedeVerEliminados, type AutorizacionCatalogo } from '../../acceso-catalogo.js'
export class ObtenerAsignacionAtributo {
  constructor(private readonly repositorio: RepositorioAsignacionesAtributo, private readonly autorizar: AutorizacionCatalogo) {}
  async ejecutar(actor: string, id: bigint): Promise<AsignacionAtributo> {
    await exigirLectura(this.autorizar, actor, 'asignaciones-atributo')
    const registro = await this.repositorio.buscarPorId(id, await puedeVerEliminados(this.autorizar, actor))
    if (!registro) throw new Error('Registro no disponible')
    return registro
  }
}
