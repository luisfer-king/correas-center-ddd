import { Prisma, type PrismaClient } from '../../../generated/prisma/client.js'
import { EventoAuditoria } from '../../identity-access-management/domain/evento-auditoria.js'
import { exigirPermisoEnTransaccion } from '../../identity-access-management/infrastructure/exigir-permiso-en-transaccion.js'
import { insertarAuditoria } from '../../identity-access-management/infrastructure/insertar-auditoria.js'
import { idCRM } from '../domain/commercial-values.js'

export type TransaccionCrm = Prisma.TransactionClient
export type RecursoCrm = 'empresas' | 'sucursales' | 'contactos' | 'suscriptores' | 'leads'

export function paginaCrm(pagina: number): number {
    if (!Number.isSafeInteger(pagina) || pagina < 1 || pagina > 10000) throw new Error('Página inválida')
    return (pagina - 1) * 100
}

export function uuidCrm(id: string): string {
    if (typeof id !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
        throw new Error('UUID inválido')
    }
    return id.toLowerCase()
}

export function versionCrm(fecha: Date): Date {
    if (!(fecha instanceof Date) || !Number.isFinite(fecha.getTime())) throw new Error('Versión inválida')
    return fecha
}

export function transaccionCrm<T>(db: PrismaClient, ejecutar: (tx: TransaccionCrm) => Promise<T>): Promise<T> {
    return db.$transaction(ejecutar, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable })
}

export async function empresaActiva(tx: TransaccionCrm, id: bigint): Promise<void> {
    if (!await tx.empresa.findFirst({
        where: { id: idCRM(id), estado: 'activo', eliminadoEn: null },
        select: { id: true }
    })) throw new Error('Empresa no disponible')
}

export function sinEliminados(incluirEliminados: boolean): { eliminadoEn?: null } {
    return incluirEliminados ? {} : { eliminadoEn: null }
}

export async function permitirGestion(tx: TransaccionCrm, actorId: string, recurso: RecursoCrm): Promise<void> {
    await exigirPermisoEnTransaccion(tx, uuidCrm(actorId), `crm.${recurso}.manage`)
}

export async function auditarCambio(tx: TransaccionCrm, actorId: string, recurso: RecursoCrm,
    id: string, estadoAnterior: string | null, estadoNuevo: string,
    eliminadoEnNuevo: Date | null = null): Promise<void> {
    const accion = estadoAnterior === null ? 'Creación' :
        (estadoNuevo === 'eliminado' || eliminadoEnNuevo !== null) ? 'Eliminación' : 'Edición'
    await insertarAuditoria(tx, EventoAuditoria.registrar({
        usuarioId: actorId, accion, tablaAfectada: recurso, registroId: id,
        // No persistir correos, teléfonos, mensajes ni nombres en el historial técnico.
        datosAnteriores: estadoAnterior === null ? null : { estado: estadoAnterior },
        datosNuevos: { estado: estadoNuevo }, ipAddress: null, userAgent: null,
        metadata: { operacion: `crm.${recurso}.manage` }, creadoEn: new Date(),
    }))
}
