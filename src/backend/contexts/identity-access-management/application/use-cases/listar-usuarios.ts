import type { Perfil } from '../../domain/perfil.js'
import type { RepositorioPerfiles } from '../ports/repositorio-perfiles.js'
import type { RepositorioRoles } from '../ports/repositorio-roles.js'
import { ExigirPermiso } from './exigir-permiso.js'

export class ListarUsuarios {
    constructor(private readonly perfiles: RepositorioPerfiles, private readonly autorizar: ExigirPermiso,
        private readonly roles: RepositorioRoles) { }
    async ejecutar(actorId: string): Promise<readonly Perfil[]> {
        await this.autorizar.ejecutar(actorId, 'iam.usuarios.read')
        const esSuper = await this.autorizar.tieneRolActivo(actorId, ['super_admin'])
        const perfiles = await this.perfiles.listar()
        if (esSuper) return perfiles
        const superRol = await this.roles.buscarPorSlug('super_admin')
        return perfiles.filter((perfil) => perfil.estado !== 'eliminado' &&
            !perfil.rolesAsignados.some((v) => v.rolId === superRol?.id))
    }
}
