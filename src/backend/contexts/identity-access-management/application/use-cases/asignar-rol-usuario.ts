import { fechaCambio } from '../fecha-cambio.js'
import type { Reloj } from '../ports/reloj.js'
import type { RepositorioPerfiles } from '../ports/repositorio-perfiles.js'
import type { RepositorioRoles } from '../ports/repositorio-roles.js'
import { ExigirPermiso } from './exigir-permiso.js'

export class AsignarRolUsuario {
    constructor(private readonly perfiles: RepositorioPerfiles, private readonly roles: RepositorioRoles,
        private readonly autorizar: ExigirPermiso, private readonly reloj: Reloj) { }
    async ejecutar(actorId: string, usuarioId: string, rolId: bigint): Promise<void> {
        await this.autorizar.ejecutar(actorId, 'iam.usuarios.roles.assign')
        const perfil = await this.perfiles.buscarPorId(usuarioId)
        const rol = await this.roles.buscarPorId(rolId)
        if (!perfil || !rol || rol.estado !== 'activo') throw new Error('Usuario o rol no disponible')
        const versionAnterior = perfil.actualizadoEn
        perfil.asignarRol(rol.id, fechaCambio(this.reloj, versionAnterior))
        await this.perfiles.guardar(perfil, versionAnterior, actorId)
    }
}