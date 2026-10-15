import type { ConfiguracionPublica } from '../../../../../shared/publico/cms.js'
export interface ConsultaPublica { obtener(empresaId: bigint, entrada: void): Promise<ConfiguracionPublica> }
