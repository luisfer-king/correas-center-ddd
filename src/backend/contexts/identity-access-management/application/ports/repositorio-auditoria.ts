import type { EventoAuditoria } from '../../domain/evento-auditoria.js'

export interface RepositorioAuditoria {
    registrar(evento: EventoAuditoria): Promise<void>
    listar(limite: number, antesDeId: bigint | null): Promise<readonly EventoAuditoria[]>
}