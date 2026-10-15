import type { ReferenciaPublica, DestinoPublico } from '../../../../../shared/publico/catalogo.js'
export interface ConsultaDestinosPublicos { resolver(empresaId: bigint, referencias: ReferenciaPublica[]): Promise<DestinoPublico[]> }
