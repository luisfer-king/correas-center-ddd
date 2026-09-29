import { EventoAuditoria } from '../../../../identity-access-management/domain/evento-auditoria.js'
import type { RepositorioAuditoria } from '../../../../identity-access-management/application/ports/repositorio-auditoria.js'
import type { Reloj } from '../../../../identity-access-management/application/ports/reloj.js'
import { codigoCatalogo, type RecursoCatalogo } from '../../acceso-catalogo.js'
export class RegistrarLecturaCatalogo {
  constructor(private readonly auditoria: RepositorioAuditoria, private readonly reloj: Reloj) {}
  async ejecutar(actor: string, recurso: RecursoCatalogo | 'portal', id: string | null = null): Promise<void> {
    await this.auditoria.registrar(EventoAuditoria.registrar({
      usuarioId: actor, accion: 'Lectura', tablaAfectada: recurso === 'portal' ? 'portal_catalogo' : recurso,
      registroId: id, datosAnteriores: null, datosNuevos: null,
      ipAddress: null, userAgent: null,
      metadata: { operacion: recurso === 'portal' ? 'catalog.portal.read' : codigoCatalogo(recurso, 'read') }, creadoEn: this.reloj.ahora(),
    }))
  }
}
