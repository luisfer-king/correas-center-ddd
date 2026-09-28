import type { Perfil } from '../../domain/perfil.js';

export interface RepositorioAdministracionUsuarios {
    crear(datos: { nombreCompleto: string; email: string; telefono: string | null; hash: string }, actorId: string): Promise<Perfil>
    actualizar(id: string, datos: { nombreCompleto: string; email: string; telefono: string | null; hash?: string },
        version: Date, actorId: string): Promise<Perfil>
    cambiarEstado(id: string, estado: 'activo' | 'inactivo' | 'eliminado',
        version: Date, actorId: string): Promise<void>
}
