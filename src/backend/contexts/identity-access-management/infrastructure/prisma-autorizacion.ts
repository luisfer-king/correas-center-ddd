import type { PrismaClient } from '../../../generated/prisma/client.js'
import type { ConsultaAutorizacion } from '../application/ports/consulta-autorizacion.js'
import { uuid } from '../domain/iam-values.js'

export class PrismaAutorizacion implements ConsultaAutorizacion {
    constructor(private readonly db: PrismaClient) { }
    async permisosEfectivos(usuarioId: string): Promise<ReadonlySet<string>> {
        const perfil = await this.db.perfil.findUnique({
            where: { id: uuid(usuarioId), estado: 'activo', eliminadoEn: null },
            select: {
                relUsuarioRol: {
                    where: { estado: 'activo', rol: { estado: 'activo', eliminadoEn: null } },
                    select: {
                        rol: {
                            select: {
                                relRolPermiso: {
                                    where: { estado: 'activo', permiso: { estado: 'activo', eliminadoEn: null } },
                                    select: { permiso: { select: { slug: true } } },
                                }
                            }
                        }
                    },
                }
            },
        })
        return new Set(perfil?.relUsuarioRol.flatMap((ur) =>
            ur.rol.relRolPermiso.map((rp) => rp.permiso.slug)) ?? [])
    }
}