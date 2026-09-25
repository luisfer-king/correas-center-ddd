import type { Permiso } from '../../domain/permiso.js'
import type { RepositorioPermisos } from '../ports/repositorio-permisos.js'
import { ExigirPermiso } from './exigir-permiso.js'

export class ObtenerPermiso {
    constructor(private readonly permisos: RepositorioPermisos, private readonly autorizar: ExigirPermiso) { }
    async ejecutar(actorId: string, permisoId: bigint): Promise<Permiso> {
        await this.autorizar.ejecutar(actorId, 'iam.permisos.read')
        const permiso = await this.permisos.buscarPorId(permisoId)
        if (!permiso) throw new Error('Permiso no encontrado')
        return permiso
    }
}