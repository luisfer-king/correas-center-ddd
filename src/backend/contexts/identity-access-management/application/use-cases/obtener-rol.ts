import type { Rol } from '../../domain/rol.js'
import type { RepositorioRoles } from '../ports/repositorio-roles.js'
import { ExigirPermiso } from './exigir-permiso.js'

export class ObtenerRol {
    constructor(private readonly roles: RepositorioRoles, private readonly autorizar: ExigirPermiso) { }
    async ejecutar(actorId: string, rolId: bigint): Promise<Rol> {
        await this.autorizar.ejecutar(actorId, 'iam.roles.read')
        const rol = await this.roles.buscarPorId(rolId)
        if (!rol) throw new Error('Rol no encontrado')
        return rol
    }
}