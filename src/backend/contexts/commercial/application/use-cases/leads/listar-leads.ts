import type { Lead } from '../../../domain/lead.js'
import type { RepositorioLeads } from '../../ports/repositorio-leads.js'
import { exigirLectura, puedeVerEliminados, type AutorizacionCrm } from '../../acceso-crm.js'

export class ListarLeads {
  constructor(private readonly repositorio: RepositorioLeads, private readonly autorizar: AutorizacionCrm) {}
  async ejecutar(actorId: string, pagina = 1): Promise<readonly Lead[]> {
    await exigirLectura(this.autorizar, actorId, 'leads')
    return this.repositorio.listar(pagina, await puedeVerEliminados(this.autorizar, actorId))
  }
}
