import { solicitarApi } from '../../../../shared/api/cliente-http.js'
import type { EmpresaPublica } from '../../../../../shared/publico/comun.js'
export function consultarEmpresaPublico(signal?: AbortSignal): Promise<EmpresaPublica> {
 return solicitarApi('/api/publico/commercial/empresa', { signal })
}
