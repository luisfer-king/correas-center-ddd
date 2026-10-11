import { EventoAuditoria } from '../../../../identity-access-management/domain/evento-auditoria.js'
import type { RepositorioAuditoria } from '../../../../identity-access-management/application/ports/repositorio-auditoria.js'
import type { Reloj } from '../../../../identity-access-management/application/ports/reloj.js'
export class RegistrarLecturaGamas {
    constructor(private readonly auditoria: RepositorioAuditoria, private readonly reloj: Reloj) { }
    async ejecutar(actor: string, recurso: 'gamas' | 'plantillas-gama', id: string | null = null): Promise<void> {
        await this.auditoria.registrar(EventoAuditoria.registrar({ usuarioId: actor, accion: 'Lectura', tablaAfectada: recurso === 'gamas' ? 'gamas_categoria' : 'plantillas_gama_producto', registroId: id, datosAnteriores: null, datosNuevos: null, ipAddress: null, userAgent: null, metadata: { operacion: 'catalog.categorias.read', recurso }, creadoEn: this.reloj.ahora() }))
    }
}
