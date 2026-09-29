import { solicitarApi } from '../../../shared/api/cliente-http'
import { idCrm, paginaCrm, rutaCrm, type ConsultaCrm } from './cliente-crm'
import type { OkCrm, SuscriptorCrm } from './tipos-crm'
const base = rutaCrm('suscriptores')
export const suscriptoresApi = {
  listar: (pagina = 1, opciones?: ConsultaCrm) => solicitarApi<SuscriptorCrm[]>(`${base}?pagina=${paginaCrm(pagina)}`, opciones),
  obtener: (id: string, opciones?: ConsultaCrm) => solicitarApi<SuscriptorCrm>(`${base}/${idCrm(id)}`, opciones),
  cambiar: (id: string, accion: 'activar' | 'inactivar' | 'desuscribir') =>
    solicitarApi<OkCrm>(`${base}/${idCrm(id)}/${accion}`, { metodo: 'PATCH' }),
}
