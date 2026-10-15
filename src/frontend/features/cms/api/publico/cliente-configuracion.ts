import { solicitarApi } from '../../../../shared/api/cliente-http.js'
import type { ConfiguracionPublica } from '../../../../../shared/publico/cms.js'
export function consultarConfiguracionPublico(signal?: AbortSignal): Promise<ConfiguracionPublica> {
 return solicitarApi('/api/publico/cms/configuracion', { signal })
}
