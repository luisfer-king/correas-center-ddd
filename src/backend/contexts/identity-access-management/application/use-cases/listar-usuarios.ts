import type { Perfil } from '../../domain/perfil.js'
import type { RepositorioPerfiles } from '../ports/repositorio-perfiles.js'
import { ExigirPermiso } from './exigir-permiso.js'

export class ListarUsuarios {
    constructor(private readonly perfiles: RepositorioPerfiles, private readonly autorizar: ExigirPermiso) { }
    async ejecutar(actorId: string): Promise<readonly Perfil[]> {
        await this.autorizar.ejecutar(actorId, 'iam.usuarios.read')
        const esSuper = await this.autorizar.tieneRolActivo(actorId, ['super_admin'])
        const perfiles = await this.perfiles.listar()
        return esSuper ? perfiles : perfiles.filter((perfil) => perfil.estado !== 'eliminado')
    }
}