import { codigoCatalogo, recursosCatalogo, type AutorizacionCatalogo } from '../../acceso-catalogo.js'
export class ObtenerCapacidadesCatalogo {
  constructor(private readonly autorizacion: AutorizacionCatalogo) {}
  async ejecutar(actor: string) {
    const recursos = Object.fromEntries(await Promise.all(recursosCatalogo.map(async recurso => [recurso, {
      leer: await this.autorizacion.tienePermiso(actor, codigoCatalogo(recurso, 'read')),
      gestionar: await this.autorizacion.tienePermiso(actor, codigoCatalogo(recurso, 'manage')),
    }] as const)))
    return { verEliminados: await this.autorizacion.tieneRolActivo(actor, ['super_admin']), recursos }
  }
}
