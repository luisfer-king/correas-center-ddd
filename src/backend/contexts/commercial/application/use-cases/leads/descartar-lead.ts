import type { RepositorioLeads } from '../../ports/repositorio-leads.js'
import { exigirGestion, type AutorizacionCrm } from '../../acceso-crm.js'
import { fechaCambioCrm, type RelojCrm } from '../../fecha-cambio-crm.js'

export class DescartarLead {
  constructor(private readonly repositorio: RepositorioLeads, private readonly autorizar: AutorizacionCrm,
    private readonly reloj: RelojCrm) {}
  async ejecutar(actorId: string, id: string): Promise<void> {
    await exigirGestion(this.autorizar, actorId, 'leads')
    const lead = await this.repositorio.buscarPorId(id, false)
    if (!lead) throw new Error('Lead no disponible')
    const version = lead.actualizadoEn
    lead.descartar(fechaCambioCrm(this.reloj, version))
    await this.repositorio.guardar(lead, version, actorId)
  }
}
