import type { Rol } from '../../domain/rol.js'

export interface RepositorioRoles {
    buscarPorId(id: bigint): Promise<Rol | null>
    buscarPorSlug(slug: string): Promise<Rol | null>
    listar(): Promise<readonly Rol[]>
    crear(datos: { nombre: string; slug: string; descripcion: string | null }, actorId: string): Promise<Rol>
    guardar(rol: Rol, versionAnterior: Date, actorId: string, permiso: 'iam.roles.update' | 'iam.roles.delete' | 'iam.roles.permisos.assign'): Promise<void>
}