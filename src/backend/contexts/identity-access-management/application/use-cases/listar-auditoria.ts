import type { EventoAuditoria } from '../../domain/evento-auditoria.js'
import type { RepositorioAuditoria } from '../ports/repositorio-auditoria.js'
import { ExigirPermiso } from './exigir-permiso.js'

export class ListarAuditoria {
    constructor(private readonly auditoria: RepositorioAuditoria,
        private readonly autorizar: ExigirPermiso) { }
    async ejecutar(actorId: string, limite = 50, antesDeId: bigint | null = null): Promise<readonly EventoAuditoria[]> {
        await this.autorizar.ejecutar(actorId, 'iam.auditoria.read')
        return this.auditoria.listar(limite, antesDeId)
    }
}