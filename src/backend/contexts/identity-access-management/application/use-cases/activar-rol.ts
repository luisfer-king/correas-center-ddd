import { fechaCambio } from '../fecha-cambio.js'
import type { Reloj } from '../ports/reloj.js'
import type { RepositorioRoles } from '../ports/repositorio-roles.js'
import { ExigirPermiso } from './exigir-permiso.js'

// Solo reactiva un rol 'inactivo'; 'eliminado' es terminal según el dominio.
export class ActivarRol {
    constructor(private readonly roles: RepositorioRoles, private readonly autorizar: ExigirPermiso,
        private readonly reloj: Reloj) { }
    async ejecutar(actorId: string, rolId: bigint): Promise<void> {
        await this.autorizar.ejecutar(actorId, 'iam.roles.update')
        const rol = await this.roles.buscarPorId(rolId)
        if (!rol) throw new Error('Rol no encontrado')
        const versionAnterior = rol.actualizadoEn
        rol.activar(fechaCambio(this.reloj, versionAnterior))
        await this.roles.guardar(rol, versionAnterior, actorId, 'iam.roles.update')
    }
}