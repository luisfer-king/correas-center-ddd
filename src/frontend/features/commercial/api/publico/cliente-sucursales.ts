import { solicitarApi } from '../../../../shared/api/cliente-http.js'
import { consultaPublica } from '../../../../shared/api/consulta-publica.js'
import type { SucursalPublica } from '../../../../../shared/publico/comun.js'
import type { ConsultaPaginaPublica, PaginaPublica } from '../../../../../shared/publico/comun.js'
export function consultarSucursalesPublico(p: Partial<ConsultaPaginaPublica> = {}, signal?: AbortSignal): Promise<PaginaPublica<SucursalPublica>> {
 return solicitarApi('/api/publico/commercial/sucursales' + consultaPublica(p), { signal })
}
