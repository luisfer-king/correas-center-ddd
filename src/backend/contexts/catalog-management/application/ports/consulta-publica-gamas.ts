import type { GamaPublica } from '../../../../../shared/publico/gamas.js'
export interface ConsultaGamaPublica {obtener(empresaId:bigint,categoriaId:string):Promise<GamaPublica|null>}
