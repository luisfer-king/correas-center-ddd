import type { Rol } from '../../domain/rol.js'
import type { RepositorioRoles } from '../ports/repositorio-roles.js'
import { ExigirPermiso } from './exigir-permiso.js'

export class ListarRoles {
    constructor(private readonly roles: RepositorioRoles, private readonly autorizar: ExigirPermiso) { }
    async ejecutar(actorId: string): Promise<readonly Rol[]> {
        await this.autorizar.ejecutar(actorId, 'iam.roles.read')
        return this.roles.listar()
    }
}