import { solicitarApi } from '../../../../shared/api/cliente-http.js'
import type { DetalleProductoPublico } from '../../../../../shared/publico/catalogo.js'
export function consultarDetalleProductoPublico(slug: string, signal?: AbortSignal): Promise<DetalleProductoPublico> {
 return solicitarApi('/api/publico/catalogo/productos/' + encodeURIComponent(slug), { signal })
}
