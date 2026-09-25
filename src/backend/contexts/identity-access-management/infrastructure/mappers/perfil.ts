import type { Prisma } from '../../../../generated/prisma/client.js'
import { Email } from '../../../../shared/domain/value-objects.js'
import { Perfil } from '../../domain/perfil.js'
import { UsuarioRol } from '../../domain/usuario-rol.js'

export type FilaPerfil = Prisma.PerfilGetPayload<{ include: { relUsuarioRol: true } }>

export function aPerfil(fila: FilaPerfil): Perfil {
    return new Perfil({
        id: fila.id, nombreCompleto: fila.nombreCompleto, telefono: fila.telefono,
        avatarUrl: fila.avatarUrl, email: fila.email ? Email.create(fila.email) : null,
        emailVerifiedAt: fila.emailVerifiedAt, estado: fila.estado,
        fechas: { creadoEn: fila.creadoEn, actualizadoEn: fila.actualizadoEn, eliminadoEn: fila.eliminadoEn },
        roles: fila.relUsuarioRol.map((v) => new UsuarioRol(v.usuarioId, v.rolId, v.creadoEn, v.estado)),
    })
}