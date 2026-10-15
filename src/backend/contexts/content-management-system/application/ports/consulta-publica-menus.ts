import type { MenuBasePublico } from '../../../../../shared/publico/cms.js'
import type { ConsultaPaginaPublica, PaginaPublica } from '../../../../../shared/publico/comun.js'
export interface ConsultaPublica { obtener(empresaId: bigint, p: ConsultaPaginaPublica): Promise<PaginaPublica<MenuBasePublico>> }
