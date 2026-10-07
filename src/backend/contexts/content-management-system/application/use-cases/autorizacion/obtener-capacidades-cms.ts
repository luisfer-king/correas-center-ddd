import { codigosPermisoCms, tieneAlternativaCms } from '../../permisos-cms.js'
import type { AutorizacionCms, RecursoCms } from '../../seguridad-cms.js'
import { actorCms } from '../../seguridad-cms.js'
export const recursosCms = ['tipos_seccion', 'contenidos_seccion', 'metadata_seccion', 'menus', 'items_menu',
  'elementos_footer', 'configuracion_sitio', 'pasos_wizard', 'registros_cms', 'contenidos_registro'] as const satisfies readonly RecursoCms[]
export interface AutorizacionCapacidadesCms extends AutorizacionCms { tienePermiso(actorId: string, codigo: string): Promise<boolean> }
export class ObtenerCapacidadesCms {
  constructor(private readonly auth: AutorizacionCapacidadesCms) {}
  async ejecutar(actorId: string) {
    const actor = actorCms(actorId)
    const entradas = await Promise.all(recursosCms.map(async recurso => [recurso, {
      leer: await tieneAlternativaCms(codigosPermisoCms(recurso, 'read'), codigo => this.auth.tienePermiso(actor, codigo)),
      gestionar: await tieneAlternativaCms(codigosPermisoCms(recurso, 'manage'), codigo => this.auth.tienePermiso(actor, codigo)),
    }] as const))
    const recursos = Object.fromEntries(entradas) as Record<RecursoCms, { leer: boolean; gestionar: boolean }>
    if (!entradas.some(([, c]) => c.leer || c.gestionar)) throw new Error('Acceso denegado')
    return { verEliminados: await this.auth.tieneRolActivo(actor, ['super_admin']), recursos }
  }
}
