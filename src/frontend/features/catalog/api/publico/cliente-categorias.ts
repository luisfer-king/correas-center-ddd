import { solicitarApi } from '../../../../shared/api/cliente-http.js'
import { consultaPublica } from '../../../../shared/api/consulta-publica.js'
import type { CategoriaPublica } from '../../../../../shared/publico/catalogo.js'
import type { ConsultaPaginaPublica, PaginaPublica } from '../../../../../shared/publico/comun.js'
export function consultarCategoriasPublico(p: Partial<ConsultaPaginaPublica> = {}, signal?: AbortSignal): Promise<PaginaPublica<CategoriaPublica>> {
 return solicitarApi('/api/publico/catalogo/categorias' + consultaPublica(p), { signal })
}
