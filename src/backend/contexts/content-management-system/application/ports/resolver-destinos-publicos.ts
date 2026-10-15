import type { ReferenciaPublica, DestinoPublico } from '../../../../../shared/publico/catalogo.js'
// Contrato de integración: CMS no importa repositorios ni dominio de Catálogo.
export interface ResolverDestinosPublicos { resolver(empresaId: bigint, referencias: ReferenciaPublica[]): Promise<DestinoPublico[]> }
