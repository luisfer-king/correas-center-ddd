import type { RepositorioServicios } from '../../ports/repositorio-servicios.js'
import type { Servicio } from '../../../domain/servicio.js'
import { exigirLectura, puedeVerEliminados, type AutorizacionCatalogo } from '../../acceso-catalogo.js'
export class ListarServicios {
  constructor(private readonly repositorio: RepositorioServicios, private readonly autorizar: AutorizacionCatalogo) {}
  async ejecutar(actor: string, pagina = 1, empresaId?: bigint): Promise<readonly Servicio[]> {
    await exigirLectura(this.autorizar, actor, 'servicios')
    return this.repositorio.listar(pagina, await puedeVerEliminados(this.autorizar, actor), empresaId)
  }
}
