export interface AutorizacionCatalogo {
  ejecutar(actorId: string, codigo: string): Promise<void>
  tienePermiso(actorId: string, codigo: string): Promise<boolean>
  tieneRolActivo(actorId: string, slugs: readonly string[]): Promise<boolean>
}
export const recursosCatalogo = ['productos','categorias','marcas','tipos-atributo','atributos-tecnicos','industrias','servicios','asignaciones-marca','asignaciones-atributo','asignaciones-industria'] as const
export type RecursoCatalogo = typeof recursosCatalogo[number]
export const codigoCatalogo = (recurso: RecursoCatalogo, accion: 'read' | 'manage') => `catalog.${recurso.replaceAll('-', '_')}.${accion}`
export const exigirLectura = (autorizacion: AutorizacionCatalogo, actor: string, recurso: RecursoCatalogo) => autorizacion.ejecutar(actor, codigoCatalogo(recurso, 'read'))
export const exigirGestion = (autorizacion: AutorizacionCatalogo, actor: string, recurso: RecursoCatalogo) => autorizacion.ejecutar(actor, codigoCatalogo(recurso, 'manage'))
export const puedeVerEliminados = (autorizacion: AutorizacionCatalogo, actor: string) => autorizacion.tieneRolActivo(actor, ['super_admin'])
