import type { Prisma } from '../../../generated/prisma/client.js'
import { CodigoPermiso, uuid } from '../domain/iam-values.js'

// Revalidar en la misma transacción Serializable que efectúa la escritura.
export async function exigirPermisoEnTransaccion(
    tx: Prisma.TransactionClient, actorId: string, codigo: string,
    rolesPermitidos?: readonly string[],
): Promise<void> {
    const id = uuid(actorId)
    const slug = CodigoPermiso.create(codigo).value
    const condiciones: Prisma.PerfilWhereInput[] = [
        {
            relUsuarioRol: {
                some: {
                    estado: 'activo', rol: {
                        estado: 'activo', eliminadoEn: null, relRolPermiso: {
                            some: {
                                estado: 'activo', permiso: { slug, estado: 'activo', eliminadoEn: null },
                            }
                        }
                    },
                }
            }
        },
    ]
    if (rolesPermitidos) condiciones.push({
        relUsuarioRol: {
            some: {
                estado: 'activo', rol: { slug: { in: [...rolesPermitidos] }, estado: 'activo', eliminadoEn: null },
            }
        }
    })
    const cuenta = await tx.perfil.findFirst({
        where: {
            id, estado: 'activo', eliminadoEn: null,
            AND: condiciones,
        }, select: { id: true }
    })
    if (!cuenta) throw new Error('Acceso denegado')
}