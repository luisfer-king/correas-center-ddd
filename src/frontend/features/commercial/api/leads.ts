import { solicitarApi } from '../../../shared/api/cliente-http'
import { idLeadCrm, paginaCrm, rutaCrm, type ConsultaCrm } from './cliente-crm'
import type { EntradaLead, LeadCrm, OkCrm } from './tipos-crm'
const base = rutaCrm('leads')
export const leadsApi = {
  listar: (pagina = 1, opciones?: ConsultaCrm) => solicitarApi<LeadCrm[]>(`${base}?pagina=${paginaCrm(pagina)}`, opciones),
  obtener: (id: string, opciones?: ConsultaCrm) => solicitarApi<LeadCrm>(`${base}/${idLeadCrm(id)}`, opciones),
  crear: (datos: EntradaLead & { empresaId: string }) => solicitarApi<LeadCrm>(base, { metodo: 'POST', cuerpo: datos }),
  asignarResponsable: (id: string, responsableId: string | null) =>
    solicitarApi<LeadCrm>(`${base}/${idLeadCrm(id)}/responsable`, { metodo: 'PATCH', cuerpo: { responsableId } }),
  cambiar: (id: string, accion: 'calificar' | 'descartar' | 'eliminar') =>
    solicitarApi<OkCrm>(`${base}/${idLeadCrm(id)}/${accion}`, { metodo: 'PATCH' }),
}
