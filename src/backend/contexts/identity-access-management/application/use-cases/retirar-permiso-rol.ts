import { fechaCambio } from '../fecha-cambio.js'
import type { Reloj } from '../ports/reloj.js'
import type { RepositorioRoles } from '../ports/repositorio-roles.js'
import { ExigirPermiso } from './exigir-permiso.js'

export class RetirarPermisoRol {
    constructor(private readonly roles: RepositorioRoles, private readonly autorizar: ExigirPermiso,
        private readonly reloj: Reloj) { }
    async ejecutar(actorId: string, rolId: bigint, permisoId: bigint): Promise<void> {
        await this.autorizar.ejecutar(actorId, 'iam.roles.permisos.assign')
        const rol = await this.roles.buscarPorId(rolId)
        if (!rol) throw new Error('Rol no encontrado')
        if (rol.esSistema) throw new Error('No se pueden retirar permisos del rol del sistema')
        const versionAnterior = rol.actualizadoEn
        rol.retirarPermiso(permisoId, fechaCambio(this.reloj, versionAnterior))
        await this.roles.guardar(rol, versionAnterior, actorId, 'iam.roles.permisos.assign')
    }
}