import type { Perfil } from '../../domain/perfil.js'

export interface RepositorioPerfiles {
    buscarPorId(id: string): Promise<Perfil | null>
    listar(): Promise<readonly Perfil[]>
    guardar(perfil: Perfil, versionAnterior: Date, actorId: string): Promise<void>
}