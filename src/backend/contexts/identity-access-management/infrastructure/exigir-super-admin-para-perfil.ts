import type { Prisma } from '../../../generated/prisma/client.js'

export async function exigirSuperAdminParaPerfil(tx: Prisma.TransactionClient,
    actorId: string, perfilId: string, asignaraSuper = false): Promise<void> {
    const tieneSuper = await tx.usuarioRol.findFirst({
        where: {
            usuarioId: perfilId, estado: 'activo', rol: { slug: 'super_admin' },
        }, select: { rolId: true }
    })
    if (!tieneSuper && !asignaraSuper) return
    const actorSuper = await tx.perfil.findFirst({
        where: {
            id: actorId, estado: 'activo', eliminadoEn: null,
            relUsuarioRol: {
                some: {
                    estado: 'activo', rol: {
                        slug: 'super_admin', estado: 'activo', eliminadoEn: null,
                    }
                }
            },
        }, select: { id: true }
    })
    if (!actorSuper) throw new Error('Acceso denegado')
}
