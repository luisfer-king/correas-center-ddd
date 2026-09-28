import type { Perfil } from '../../domain/perfil.js'
import type { RepositorioPerfiles } from '../ports/repositorio-perfiles.js'
import type { RepositorioRoles } from '../ports/repositorio-roles.js'
import { ExigirPermiso } from './exigir-permiso.js'

export class ObtenerUsuario {
    constructor(private readonly perfiles: RepositorioPerfiles, private readonly autorizar: ExigirPermiso,
        private readonly roles: RepositorioRoles) { }
    async ejecutar(actorId: string, usuarioId: string): Promise<Perfil> {
        await this.autorizar.ejecutar(actorId, 'iam.usuarios.read')
        const perfil = await this.perfiles.buscarPorId(usuarioId)
        if (!perfil) throw new Error('Usuario no encontrado')
        const esSuper = await this.autorizar.tieneRolActivo(actorId, ['super_admin'])
        if (!esSuper) {
            const superRol = await this.roles.buscarPorSlug('super_admin')
            if (perfil.estado === 'eliminado' ||
                perfil.rolesAsignados.some((v) => v.rolId === superRol?.id)) throw new Error('Usuario no encontrado')
        }
        return perfil
    }
}
