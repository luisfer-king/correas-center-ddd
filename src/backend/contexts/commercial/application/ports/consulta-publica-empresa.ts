import type { EmpresaPublica } from '../../../../../shared/publico/comun.js'
import type { ConsultaPaginaPublica, PaginaPublica } from '../../../../../shared/publico/comun.js'
export interface ConsultaPublica { obtener(empresaId: bigint, entrada: void): Promise<EmpresaPublica | null> }
