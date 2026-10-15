import type { RegistroPublicado } from '../../../../../shared/publico/cms.js'
import type { ConsultaPaginaPublica, PaginaPublica } from '../../../../../shared/publico/comun.js'
export interface ConsultaPublica { obtener(empresaId: bigint, entrada: ConsultaPaginaPublica): Promise<PaginaPublica<RegistroPublicado>> }
