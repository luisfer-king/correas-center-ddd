import type { Rol } from '../../domain/rol.js'
import { fechaCambio } from '../fecha-cambio.js'
import type { Reloj } from '../ports/reloj.js'
import type { RepositorioRoles } from '../ports/repositorio-roles.js'
import { ExigirPermiso } from './exigir-permiso.js'

export class EditarRol {
    constructor(private readonly roles: RepositorioRoles, private readonly autorizar: ExigirPermiso,
        private readonly reloj: Reloj) { }
    async ejecutar(actorId: string, rolId: bigint, nombre: string, descripcion: string | null): Promise<Rol> {
        await this.autorizar.ejecutar(actorId, 'iam.roles.update')
        const rol = await this.roles.buscarPorId(rolId)
        if (!rol) throw new Error('Rol no encontrado')
        if (rol.esSistema) throw new Error('Rol del sistema protegido')
        const versionAnterior = rol.actualizadoEn
        rol.editar(nombre, descripcion, fechaCambio(this.reloj, versionAnterior))
        await this.roles.guardar(rol, versionAnterior, actorId, 'iam.roles.update')
        return rol
    }
}