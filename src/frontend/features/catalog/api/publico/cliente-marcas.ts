import { solicitarApi } from '../../../../shared/api/cliente-http.js'
import { consultaPublica } from '../../../../shared/api/consulta-publica.js'
import type { MarcaPublica } from '../../../../../shared/publico/catalogo.js'
import type { ConsultaPaginaPublica, PaginaPublica } from '../../../../../shared/publico/comun.js'
export function consultarMarcasPublico(p: Partial<ConsultaPaginaPublica> = {}, signal?: AbortSignal): Promise<PaginaPublica<MarcaPublica>> {
 return solicitarApi('/api/publico/catalogo/marcas' + consultaPublica(p), { signal })
}
