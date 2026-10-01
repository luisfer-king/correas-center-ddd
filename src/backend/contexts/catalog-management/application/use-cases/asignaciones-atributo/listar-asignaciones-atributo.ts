import type { RepositorioAsignacionesAtributo } from '../../ports/repositorio-asignaciones-atributo.js'
import type { AsignacionAtributo } from '../../../domain/asignacion-atributo.js'
import { exigirLectura, puedeVerEliminados, type AutorizacionCatalogo } from '../../acceso-catalogo.js'
export class ListarAsignacionesAtributo {
  constructor(private readonly repositorio: RepositorioAsignacionesAtributo, private readonly autorizar: AutorizacionCatalogo) {}
  async ejecutar(actor: string, pagina = 1, categoriaId: bigint): Promise<readonly AsignacionAtributo[]> {
    await exigirLectura(this.autorizar, actor, 'asignaciones-atributo')
    return this.repositorio.listar(pagina, await puedeVerEliminados(this.autorizar, actor), categoriaId)
  }
}
