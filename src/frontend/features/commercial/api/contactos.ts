import { solicitarApi } from '../../../shared/api/cliente-http'
import { idCrm, paginaCrm, rutaCrm, type ConsultaCrm } from './cliente-crm'
import type { ContactoCrm, OkCrm } from './tipos-crm'
const base = rutaCrm('contactos')
export const contactosApi = {
  listar: (pagina = 1, opciones?: ConsultaCrm) => solicitarApi<ContactoCrm[]>(`${base}?pagina=${paginaCrm(pagina)}`, opciones),
  obtener: (id: string, opciones?: ConsultaCrm) => solicitarApi<ContactoCrm>(`${base}/${idCrm(id)}`, opciones),
  cambiar: (id: string, accion: 'respondido' | 'archivar') =>
    solicitarApi<OkCrm>(`${base}/${idCrm(id)}/${accion}`, { metodo: 'PATCH' }),
}
