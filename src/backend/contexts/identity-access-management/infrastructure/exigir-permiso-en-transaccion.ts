import type { Prisma } from '../../../generated/prisma/client.js'
import { CodigoPermiso, uuid } from '../domain/iam-values.js'

// Revalidar en la misma transacción Serializable que efectúa la escritura.
export async function exigirPermisoEnTransaccion(
    tx: Prisma.TransactionClient, actorId: string, codigo: string,
): Promise<void> {
    const id = uuid(actorId)
    const slug = CodigoPermiso.create(codigo).value
    const cuenta = await tx.perfil.findFirst({
        where: {
            id, estado: 'activo', eliminadoEn: null,
            relUsuarioRol: {
                some: {
                    estado: 'activo',
                    rol: {
                        estado: 'activo', eliminadoEn: null, relRolPermiso: {
                            some: {
                                estado: 'activo', permiso: { slug, estado: 'activo', eliminadoEn: null },
                            }
                        }
                    },
                }
            },
        }, select: { id: true }
    })
    if (!cuenta) throw new Error('Acceso denegado')
}