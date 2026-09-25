import { fechaCambio } from '../fecha-cambio.js'
import type { Reloj } from '../ports/reloj.js'
import type { RepositorioPermisos } from '../ports/repositorio-permisos.js'
import type { RepositorioRoles } from '../ports/repositorio-roles.js'
import { ExigirPermiso } from './exigir-permiso.js'

export class AsignarPermisoRol {
    constructor(private readonly roles: RepositorioRoles, private readonly permisos: RepositorioPermisos,
        private readonly autorizar: ExigirPermiso, private readonly reloj: Reloj) { }
    async ejecutar(actorId: string, rolId: bigint, permisoId: bigint): Promise<void> {
        await this.autorizar.ejecutar(actorId, 'iam.roles.permisos.assign')
        const rol = await this.roles.buscarPorId(rolId)
        const permiso = await this.permisos.buscarPorId(permisoId)
        if (!rol || !permiso || permiso.estado !== 'activo') throw new Error('Rol o permiso no disponible')
        const versionAnterior = rol.actualizadoEn
        rol.asignarPermiso(permiso.id, fechaCambio(this.reloj, versionAnterior))
        await this.roles.guardar(rol, versionAnterior, actorId, 'iam.roles.permisos.assign')
    }
}