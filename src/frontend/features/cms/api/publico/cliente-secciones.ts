import { solicitarApi } from '../../../../shared/api/cliente-http.js'
import { consultaPublica } from '../../../../shared/api/consulta-publica.js'
import type { SeccionPublicada } from '../../../../../shared/publico/cms.js'
import type { ConsultaPaginaPublica, PaginaPublica } from '../../../../../shared/publico/comun.js'
export function consultarSeccionesPublico(p: Partial<ConsultaPaginaPublica> = {}, signal?: AbortSignal): Promise<PaginaPublica<SeccionPublicada>> {
 return solicitarApi('/api/publico/cms/secciones' + consultaPublica(p), { signal })
}
