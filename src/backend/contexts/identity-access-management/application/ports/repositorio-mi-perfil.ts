import type { Perfil } from '../../domain/perfil.js';

export interface RepositorioMiPerfil {
    actualizar(actorId: string, datos: { nombreCompleto: string; telefono: string | null }, version: Date): Promise<Perfil>
    cambiarClave(actorId: string, actual: string, nueva: string): Promise<void>
}
