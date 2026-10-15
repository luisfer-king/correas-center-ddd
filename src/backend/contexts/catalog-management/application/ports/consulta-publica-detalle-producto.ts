import type { DetalleProductoPublico } from '../../../../../shared/publico/catalogo.js'
export interface ConsultaPublica { obtener(empresaId: bigint, slug: string): Promise<DetalleProductoPublico | null> }
