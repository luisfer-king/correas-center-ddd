/** Contrato estructural compatible con ExigirPermiso de IAM. */
export interface AutorizacionCms {
  ejecutar(actorId: string, codigo: string): Promise<void>
  tieneRolActivo(actorId: string, slugs: readonly string[]): Promise<boolean>
}
export type ContextoAccionCms = Readonly<{ actorId: string; ipAddress?: string | null; userAgent?: string | null }>
export type RecursoCms = 'tipos_seccion' | 'contenidos_seccion' | 'metadata_seccion' | 'menus' | 'items_menu' |
  'elementos_footer' | 'configuracion_sitio' | 'pasos_wizard' | 'registros_cms' | 'contenidos_registro'
export function actorCms(actorId: string): string {
  if (typeof actorId !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(actorId)) throw new Error('UUID inválido')
  return actorId.toLowerCase()
}
export async function permitirCms(auth: AutorizacionCms, actorId: string, recurso: RecursoCms, accion: 'read' | 'manage'): Promise<void> {
  await auth.ejecutar(actorCms(actorId), `cms.${recurso}.${accion}`)
}
export async function verEliminadosCms(auth: AutorizacionCms, actorId: string): Promise<boolean> {
  return auth.tieneRolActivo(actorCms(actorId), ['super_admin'])
}
