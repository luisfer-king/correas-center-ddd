import type { EventoAuditoria } from '../../domain/evento-auditoria.js';
import type { RepositorioAuditoria } from '../ports/repositorio-auditoria.js';
import { ExigirPermiso } from './exigir-permiso.js';

export class ListarAuditoria {
    constructor(private readonly auditoria: RepositorioAuditoria,
        private readonly autorizar: ExigirPermiso) { }
    async ejecutar(actorId: string, limite = 50, antesDeId: bigint | null = null,
        rango: { desde: Date | null; hasta: Date | null } = { desde: null, hasta: null }): Promise<readonly EventoAuditoria[]> {
        await this.autorizar.ejecutar(actorId, 'iam.auditoria.read')
        if ((rango.desde && Number.isNaN(rango.desde.getTime())) ||
            (rango.hasta && Number.isNaN(rango.hasta.getTime())) ||
            (rango.desde && rango.hasta && rango.desde >= rango.hasta)) throw new Error('Rango de fechas inválido')
        return this.auditoria.listar(limite, antesDeId, rango)
    }
}