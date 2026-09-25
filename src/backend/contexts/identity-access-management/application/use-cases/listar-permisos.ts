import type { Permiso } from '../../domain/permiso.js'
import type { RepositorioPermisos } from '../ports/repositorio-permisos.js'
import { ExigirPermiso } from './exigir-permiso.js'

export class ListarPermisos {
    constructor(private readonly permisos: RepositorioPermisos, private readonly autorizar: ExigirPermiso) { }
    async ejecutar(actorId: string): Promise<readonly Permiso[]> {
        await this.autorizar.ejecutar(actorId, 'iam.permisos.read')
        return this.permisos.listar()
    }
}