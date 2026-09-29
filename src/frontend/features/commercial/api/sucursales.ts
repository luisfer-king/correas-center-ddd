import { solicitarApi } from '../../../shared/api/cliente-http'
import { idCrm, paginaCrm, rutaCrm, type ConsultaCrm } from './cliente-crm'
import type { EntradaSucursal, OkCrm, SucursalCrm } from './tipos-crm'
const base = rutaCrm('sucursales')
export const sucursalesApi = {
  listar: (pagina = 1, opciones?: ConsultaCrm) => solicitarApi<SucursalCrm[]>(`${base}?pagina=${paginaCrm(pagina)}`, opciones),
  obtener: (id: string, opciones?: ConsultaCrm) => solicitarApi<SucursalCrm>(`${base}/${idCrm(id)}`, opciones),
  crear: (datos: EntradaSucursal & { empresaId: string }) => solicitarApi<SucursalCrm>(base, { metodo: 'POST', cuerpo: datos }),
  editar: (id: string, datos: EntradaSucursal) => solicitarApi<SucursalCrm>(`${base}/${idCrm(id)}`, { metodo: 'PATCH', cuerpo: datos }),
  cambiar: (id: string, accion: 'activar' | 'inactivar' | 'eliminar') =>
    solicitarApi<OkCrm>(`${base}/${idCrm(id)}/${accion}`, { metodo: 'PATCH' }),
}
