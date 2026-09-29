import type { Lead } from '../../../domain/lead.js'
import type { RepositorioLeads } from '../../ports/repositorio-leads.js'
import { exigirLectura, puedeVerEliminados, type AutorizacionCrm } from '../../acceso-crm.js'

export class ObtenerLead {
  constructor(private readonly repositorio: RepositorioLeads, private readonly autorizar: AutorizacionCrm) {}
  async ejecutar(actorId: string, id: string): Promise<Lead> {
    await exigirLectura(this.autorizar, actorId, 'leads')
    const lead = await this.repositorio.buscarPorId(id, await puedeVerEliminados(this.autorizar, actorId))
    if (!lead) throw new Error('Lead no disponible')
    return lead
  }
}
