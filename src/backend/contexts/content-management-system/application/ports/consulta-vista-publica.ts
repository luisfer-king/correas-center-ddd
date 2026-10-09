import type { VistaPublica } from '../../../../../shared/vista-publica.js'
export interface ConsultaVistaPublica { obtener(empresaId: bigint): Promise<VistaPublica | null> }
