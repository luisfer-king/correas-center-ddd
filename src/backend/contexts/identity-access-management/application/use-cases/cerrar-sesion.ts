import { EventoAuditoria } from '../../domain/evento-auditoria.js'
import type { Reloj } from '../ports/reloj.js'
import type { RepositorioSesiones } from '../ports/repositorio-sesiones.js'
import { ComprobarSesion } from './comprobar-sesion.js'

export class CerrarSesion {
    constructor(private readonly comprobar: ComprobarSesion,
        private readonly sesiones: RepositorioSesiones, private readonly reloj: Reloj) { }
    async ejecutar(jwt: string): Promise<void> {
        const { usuarioId, sesion } = await this.comprobar.ejecutar(jwt)
        const ahora = this.reloj.ahora()
        sesion.revocar(ahora)
        const evento = EventoAuditoria.registrar({
            usuarioId, accion: 'Edición', tablaAfectada: 'sesiones',
            registroId: sesion.id, datosAnteriores: { estado: 'activo' },
            datosNuevos: { estado: 'inactivo' }, ipAddress: null, userAgent: null,
            metadata: { operacion: 'iam.sesiones.cerrar' }, creadoEn: ahora,
        })
        await this.sesiones.revocar(sesion, evento)
    }
}