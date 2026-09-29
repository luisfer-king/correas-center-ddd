import type { RepositorioAsignacionesMarca } from '../../ports/repositorio-asignaciones-marca.js'
import type { AsignacionMarca } from '../../../domain/asignacion-marca.js'
import { exigirLectura, puedeVerEliminados, type AutorizacionCatalogo } from '../../acceso-catalogo.js'
export class ObtenerAsignacionMarca {
  constructor(private readonly repositorio: RepositorioAsignacionesMarca, private readonly autorizar: AutorizacionCatalogo) {}
  async ejecutar(actor: string, id: bigint): Promise<AsignacionMarca> {
    await exigirLectura(this.autorizar, actor, 'asignaciones-marca')
    const registro = await this.repositorio.buscarPorId(id, await puedeVerEliminados(this.autorizar, actor))
    if (!registro) throw new Error('Registro no disponible')
    return registro
  }
}
