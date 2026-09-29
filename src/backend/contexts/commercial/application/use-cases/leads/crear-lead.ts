import type { RepositorioEmpresas } from '../../ports/repositorio-empresas.js'
import type { RepositorioContactosEntrantes } from '../../ports/repositorio-contactos-entrantes.js'
import type { RepositorioLeads } from '../../ports/repositorio-leads.js'
import { exigirGestion, type AutorizacionCrm } from '../../acceso-crm.js'
import { idCRM } from '../../../domain/commercial-values.js'
import { Lead } from '../../../domain/lead.js'

export class CrearLead {
  constructor(private readonly leads: RepositorioLeads,
    private readonly empresas: RepositorioEmpresas,
    private readonly contactos: RepositorioContactosEntrantes,
    private readonly autorizar: AutorizacionCrm) {}
  async ejecutar(actorId: string, datos: { empresaId: bigint; contactoId: bigint | null;
    responsableId: string | null }) {
    await exigirGestion(this.autorizar, actorId, 'leads')
    const ahora = new Date()
    // Identidad provisional para validar los valores del dominio; Prisma crea la definitiva.
    const lead = new Lead({ id: '00000000-0000-4000-8000-000000000001',
      empresaId: idCRM(datos.empresaId), contactoId: datos.contactoId,
      responsableId: datos.responsableId, estado: 'nuevo',
      creadoEn: ahora, actualizadoEn: ahora, eliminadoEn: null })
    const empresa = await this.empresas.buscarPorId(lead.empresaId, false)
    if (empresa?.estado !== 'activo') throw new Error('Empresa no disponible')
    if (lead.contactoId !== null) {
      const contacto = await this.contactos.buscarPorId(lead.contactoId, false)
      if (!contacto || contacto.empresaId !== lead.empresaId) throw new Error('Contacto no disponible')
      if (await this.leads.buscarPorContactoId(lead.contactoId, true)) {
        throw new Error('El contacto ya tiene un lead')
      }
    }
    return this.leads.crear({ empresaId: lead.empresaId, contactoId: lead.contactoId,
      responsableId: lead.responsableId }, actorId)
  }
}
