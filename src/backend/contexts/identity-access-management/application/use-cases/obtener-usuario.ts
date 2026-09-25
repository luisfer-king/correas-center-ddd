import type { Perfil } from '../../domain/perfil.js'
import type { RepositorioPerfiles } from '../ports/repositorio-perfiles.js'
import { ExigirPermiso } from './exigir-permiso.js'

export class ObtenerUsuario {
    constructor(private readonly perfiles: RepositorioPerfiles, private readonly autorizar: ExigirPermiso) { }
    async ejecutar(actorId: string, usuarioId: string): Promise<Perfil> {
        await this.autorizar.ejecutar(actorId, 'iam.usuarios.read')
        const perfil = await this.perfiles.buscarPorId(usuarioId)
        if (!perfil) throw new Error('Usuario no encontrado')
        return perfil
    }
}