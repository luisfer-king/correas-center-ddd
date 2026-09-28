import { fechaCambio } from '../fecha-cambio.js'
import type { Reloj } from '../ports/reloj.js'
import type { RepositorioPerfiles } from '../ports/repositorio-perfiles.js'
import type { RepositorioRoles } from '../ports/repositorio-roles.js'
import { ExigirPermiso } from './exigir-permiso.js'

export class RetirarRolUsuario {
    constructor(private readonly perfiles: RepositorioPerfiles, private readonly autorizar: ExigirPermiso,
        private readonly reloj: Reloj, private readonly roles: RepositorioRoles) { }
    async ejecutar(actorId: string, usuarioId: string, rolId: bigint): Promise<void> {
        await this.autorizar.ejecutar(actorId, 'iam.usuarios.roles.assign')
        const perfil = await this.perfiles.buscarPorId(usuarioId)
        if (!perfil) throw new Error('Perfil no encontrado')
        const superRol = await this.roles.buscarPorSlug('super_admin')
        if ((rolId === superRol?.id || perfil.rolesAsignados.some((v) => v.rolId === superRol?.id)) &&
            !(await this.autorizar.tieneRolActivo(actorId, ['super_admin']))) throw new Error('Perfil no encontrado')
        const versionAnterior = perfil.actualizadoEn
        perfil.retirarRol(rolId, fechaCambio(this.reloj, versionAnterior))
        // El repositorio bloquea la retirada del último super_admin activo.
        await this.perfiles.guardar(perfil, versionAnterior, actorId)
    }
}
