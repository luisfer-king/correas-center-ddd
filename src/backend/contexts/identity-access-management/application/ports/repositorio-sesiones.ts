import type { EventoAuditoria } from '../../domain/evento-auditoria.js'
import type { Sesion } from '../../domain/sesion.js'

export interface RepositorioSesiones {
    crear(sesion: Sesion, evento: EventoAuditoria): Promise<void>
    buscarPorId(id: string): Promise<Sesion | null>
    revocar(sesion: Sesion, evento: EventoAuditoria): Promise<void>
}