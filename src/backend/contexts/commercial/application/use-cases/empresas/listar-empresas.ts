import type { Empresa } from '../../../domain/empresa.js'
import type { RepositorioEmpresas } from '../../ports/repositorio-empresas.js'
import { exigirLectura, puedeVerEliminados, type AutorizacionCrm } from '../../acceso-crm.js'

export class ListarEmpresas {
  constructor(private readonly repositorio: RepositorioEmpresas, private readonly autorizar: AutorizacionCrm) {}
  async ejecutar(actorId: string, pagina = 1): Promise<readonly Empresa[]> {
    await exigirLectura(this.autorizar, actorId, 'empresas')
    return this.repositorio.listar(pagina, await puedeVerEliminados(this.autorizar, actorId))
  }
}
