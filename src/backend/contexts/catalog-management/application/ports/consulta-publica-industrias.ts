import type { IndustriaPublica } from '../../../../../shared/publico/catalogo.js'
import type { ConsultaPaginaPublica, PaginaPublica } from '../../../../../shared/publico/comun.js'
export interface ConsultaPublica { obtener(empresaId: bigint, entrada: ConsultaPaginaPublica): Promise<PaginaPublica<IndustriaPublica>> }
