import type { RepositorioAsignacionesMarca } from '../../ports/repositorio-asignaciones-marca.js'
import type { AsignacionMarca } from '../../../domain/asignacion-marca.js'
import { exigirLectura, puedeVerEliminados, type AutorizacionCatalogo } from '../../acceso-catalogo.js'
export class ListarAsignacionesMarca {
  constructor(private readonly repositorio: RepositorioAsignacionesMarca, private readonly autorizar: AutorizacionCatalogo) {}
  async ejecutar(actor: string, pagina = 1, productoId: bigint): Promise<readonly AsignacionMarca[]> {
    await exigirLectura(this.autorizar, actor, 'asignaciones-marca')
    return this.repositorio.listar(pagina, await puedeVerEliminados(this.autorizar, actor), productoId)
  }
}
