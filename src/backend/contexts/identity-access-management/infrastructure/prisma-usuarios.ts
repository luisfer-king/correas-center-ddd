import type { PrismaClient } from '../../../generated/prisma/client.js'
import type { Email } from '../../../shared/domain/value-objects.js'
import type { RepositorioUsuarios } from '../application/ports/repositorio-usuarios.js'
import { uuid } from '../domain/iam-values.js'
import type { Usuario } from '../domain/usuario.js'
import { aUsuario } from './mappers/usuario.js'

export class PrismaUsuarios implements RepositorioUsuarios {
    constructor(private readonly db: PrismaClient) { }
    async buscarPorId(id: string): Promise<Usuario | null> {
        const fila = await this.db.usuario.findUnique({ where: { id: uuid(id) } })
        return fila ? aUsuario(fila) : null
    }
    async buscarPorEmail(email: Email): Promise<Usuario | null> {
        const fila = await this.db.usuario.findUnique({ where: { email: email.value } })
        return fila ? aUsuario(fila) : null
    }
}