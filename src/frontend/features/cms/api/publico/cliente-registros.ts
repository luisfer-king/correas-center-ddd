import { solicitarApi } from '../../../../shared/api/cliente-http.js'
import { consultaPublica } from '../../../../shared/api/consulta-publica.js'
import type { RegistroPublicado } from '../../../../../shared/publico/cms.js'
import type { ConsultaPaginaPublica, PaginaPublica } from '../../../../../shared/publico/comun.js'
export function consultarRegistrosPublico(p: Partial<ConsultaPaginaPublica> = {}, signal?: AbortSignal): Promise<PaginaPublica<RegistroPublicado>> {
 return solicitarApi('/api/publico/cms/registros' + consultaPublica(p), { signal })
}
