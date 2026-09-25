import type { Prisma } from '../../../../generated/prisma/client.js'
import { Email } from '../../../../shared/domain/value-objects.js'
import { HashArgon2id } from '../../domain/iam-values.js'
import { Usuario } from '../../domain/usuario.js'

export type FilaUsuario = Prisma.UsuarioGetPayload<{}>

export function aUsuario(fila: FilaUsuario): Usuario | null {
    if (!fila.email) return null
    return new Usuario(fila.id, Email.create(fila.email),
        fila.encryptedPassword ? HashArgon2id.fromHash(fila.encryptedPassword) : null)
}