import type { AutorizacionCrm, RecursoCrm } from '../../acceso-crm.js'

export class ObtenerCapacidadesCrm {
  constructor(private readonly autorizar: AutorizacionCrm) {}

  async ejecutar(actorId: string) {
    const recursos: RecursoCrm[] = ['empresas', 'sucursales', 'contactos', 'suscriptores', 'leads']
    const [esSuper, ...pares] = await Promise.all([
      this.autorizar.tieneRolActivo(actorId, ['super_admin']),
      ...recursos.map(async (recurso) => [recurso, {
        leer: await this.autorizar.tienePermiso(actorId, `crm.${recurso}.read`),
        gestionar: await this.autorizar.tienePermiso(actorId, `crm.${recurso}.manage`),
      }] as const),
    ])
    return { verEliminados: esSuper, recursos: Object.fromEntries(pares) as Record<RecursoCrm,
      { leer: boolean; gestionar: boolean }> }
  }
}
