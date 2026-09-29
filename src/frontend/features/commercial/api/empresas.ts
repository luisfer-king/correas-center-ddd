import { solicitarApi } from '../../../shared/api/cliente-http'
import { idCrm, paginaCrm, rutaCrm, type ConsultaCrm } from './cliente-crm'
import type { EmpresaCrm, EntradaEmpresa, OkCrm } from './tipos-crm'
const base = rutaCrm('empresas')
export const empresasApi = {
  listar: (pagina = 1, opciones?: ConsultaCrm) => solicitarApi<EmpresaCrm[]>(`${base}?pagina=${paginaCrm(pagina)}`, opciones),
  obtener: (id: string, opciones?: ConsultaCrm) => solicitarApi<EmpresaCrm>(`${base}/${idCrm(id)}`, opciones),
  crear: (datos: EntradaEmpresa) => solicitarApi<EmpresaCrm>(base, { metodo: 'POST', cuerpo: datos }),
  editar: (id: string, datos: EntradaEmpresa) => solicitarApi<EmpresaCrm>(`${base}/${idCrm(id)}`, { metodo: 'PATCH', cuerpo: datos }),
  cambiar: (id: string, accion: 'activar' | 'inactivar' | 'eliminar') =>
    solicitarApi<OkCrm>(`${base}/${idCrm(id)}/${accion}`, { metodo: 'PATCH' }),
}
