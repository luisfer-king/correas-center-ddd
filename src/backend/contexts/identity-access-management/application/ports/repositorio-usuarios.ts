import type { Email } from '../../../../shared/domain/value-objects.js'
import type { Usuario } from '../../domain/usuario.js'

export interface RepositorioUsuarios {
    buscarPorId(id: string): Promise<Usuario | null>
    buscarPorEmail(email: Email): Promise<Usuario | null>
}