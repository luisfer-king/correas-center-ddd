import type { Permiso } from '../../domain/permiso.js'

export interface RepositorioPermisos {
    buscarPorId(id: bigint): Promise<Permiso | null>
    listar(): Promise<readonly Permiso[]>
}