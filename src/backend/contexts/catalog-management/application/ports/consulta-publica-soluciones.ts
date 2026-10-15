import type { DetalleIndustriaPublica, DetalleServicioPublico } from '../../../../../shared/publico/catalogo.js'
export interface ConsultaPublicaSoluciones {
 industria(empresaId: bigint, slug: string): Promise<DetalleIndustriaPublica | null>
 servicio(empresaId: bigint, slug: string): Promise<DetalleServicioPublico | null>
}
