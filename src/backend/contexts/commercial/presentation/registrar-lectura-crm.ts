import { EventoAuditoria } from '../../identity-access-management/domain/evento-auditoria.js'
import type { RepositorioAuditoria } from '../../identity-access-management/application/ports/repositorio-auditoria.js'
import type { Reloj } from '../../identity-access-management/application/ports/reloj.js'

export type RecursoLecturaCrm = 'portal' | 'empresas' | 'sucursales' | 'contactos' | 'suscriptores' | 'leads'

export class RegistrarLecturaCrm {
  constructor(private readonly auditoria: RepositorioAuditoria, private readonly reloj: Reloj) {}

  async ejecutar(actorId: string, recurso: RecursoLecturaCrm, registroId: string | null = null) {
    await this.auditoria.registrar(EventoAuditoria.registrar({
      usuarioId: actorId, accion: 'Lectura', tablaAfectada: recurso === 'portal' ? 'portal_crm' : recurso,
      registroId, datosAnteriores: null, datosNuevos: null,
      ipAddress: null, userAgent: null, metadata: { operacion: `crm.${recurso}.read` },
      creadoEn: this.reloj.ahora(),
    }))
  }
}
