import type { RepositorioLeads } from '../../ports/repositorio-leads.js'
import { exigirGestion, type AutorizacionCrm } from '../../acceso-crm.js'
import { fechaCambioCrm, type RelojCrm } from '../../fecha-cambio-crm.js'

export class AsignarResponsableLead {
  constructor(private readonly leads: RepositorioLeads, private readonly autorizar: AutorizacionCrm,
    private readonly reloj: RelojCrm) {}
  async ejecutar(actorId: string, id: string, responsableId: string | null) {
    await exigirGestion(this.autorizar, actorId, 'leads')
    const lead = await this.leads.buscarPorId(id, false)
    if (!lead) throw new Error('Lead no disponible')
    const version = lead.actualizadoEn
    lead.asignarResponsable(responsableId, fechaCambioCrm(this.reloj, version))
    await this.leads.guardar(lead, version, actorId)
    return lead
  }
}
