import type { PrismaClient } from '../../../generated/prisma/client.js'
import type { RepositorioPermisos } from '../application/ports/repositorio-permisos.js'
import { idPositivo } from '../domain/iam-values.js'
import type { Permiso } from '../domain/permiso.js'
import { aPermiso } from './mappers/permiso.js'

export class PrismaPermisos implements RepositorioPermisos {
    constructor(private readonly db: PrismaClient) { }
    async buscarPorId(id: bigint): Promise<Permiso | null> {
        const fila = await this.db.permiso.findUnique({ where: { id: idPositivo(id) } })
        return fila ? aPermiso(fila) : null
    }
    async listar(): Promise<readonly Permiso[]> {
        return (await this.db.permiso.findMany({ orderBy: { nombre: 'asc' } })).map(aPermiso)
    }
}