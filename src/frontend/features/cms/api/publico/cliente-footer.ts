import { solicitarApi } from '../../../../shared/api/cliente-http.js'
import { consultaPublica } from '../../../../shared/api/consulta-publica.js'
import type { FooterPublicado } from '../../../../../shared/publico/cms.js'
import type { ConsultaPaginaPublica, PaginaPublica } from '../../../../../shared/publico/comun.js'
export function consultarFooterPublico(p: Partial<ConsultaPaginaPublica> = {}, signal?: AbortSignal): Promise<PaginaPublica<FooterPublicado>> {
 return solicitarApi('/api/publico/cms/footer' + consultaPublica(p), { signal })
}
