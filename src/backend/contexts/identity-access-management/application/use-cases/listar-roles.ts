import type { Rol } from '../../domain/rol.js'
import type { RepositorioRoles } from '../ports/repositorio-roles.js'
import { ExigirPermiso } from './exigir-permiso.js'

export class ListarRoles {
    constructor(private readonly roles: RepositorioRoles, private readonly autorizar: ExigirPermiso) { }
    async ejecutar(actorId: string): Promise<readonly Rol[]> {
        await this.autorizar.ejecutar(actorId, 'iam.roles.read')
        const esSuper = await this.autorizar.tieneRolActivo(actorId, ['super_admin'])
        const roles = await this.roles.listar()
        return esSuper ? roles : roles.filter((rol) => rol.estado !== 'eliminado' && rol.slug.value !== 'super_admin')
    }
}
