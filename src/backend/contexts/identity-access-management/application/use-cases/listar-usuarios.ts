import type { Perfil } from '../../domain/perfil.js'
import type { RepositorioPerfiles } from '../ports/repositorio-perfiles.js'
import { ExigirPermiso } from './exigir-permiso.js'

export class ListarUsuarios {
    constructor(private readonly perfiles: RepositorioPerfiles, private readonly autorizar: ExigirPermiso) { }
    async ejecutar(actorId: string): Promise<readonly Perfil[]> {
        await this.autorizar.ejecutar(actorId, 'iam.usuarios.read')
        return this.perfiles.listar()
    }
}