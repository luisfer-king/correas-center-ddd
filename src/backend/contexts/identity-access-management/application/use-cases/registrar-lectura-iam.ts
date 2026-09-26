import { EventoAuditoria } from '../../domain/evento-auditoria.js'
import type { Reloj } from '../ports/reloj.js'
import type { RepositorioAuditoria } from '../ports/repositorio-auditoria.js'

type Recurso = 'portal' | 'roles' | 'permisos' | 'usuarios' | 'auditoria'

const tabla: Record<Recurso, string> = {
    portal: 'portal_iam', roles: 'rol', permisos: 'permiso', usuarios: 'perfil', auditoria: 'auditoria',
}

export class RegistrarLecturaIam {
    constructor(private readonly auditoria: RepositorioAuditoria, private readonly reloj: Reloj) { }

    async ejecutar(actorId: string, recurso: Recurso, registroId: string | null = null): Promise<void> {
        await this.auditoria.registrar(EventoAuditoria.registrar({
            usuarioId: actorId, accion: 'Lectura', tablaAfectada: tabla[recurso], registroId,
            datosAnteriores: null, datosNuevos: null, ipAddress: null, userAgent: null,
            metadata: { operacion: `iam.${recurso}.read` }, creadoEn: this.reloj.ahora(),
        }))
    }
}