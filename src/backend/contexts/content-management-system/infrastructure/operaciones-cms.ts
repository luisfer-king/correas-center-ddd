import { Prisma, type PrismaClient } from '../../../generated/prisma/client.js'
import type { Json } from '../../identity-access-management/domain/iam-values.js'
import { EventoAuditoria } from '../../identity-access-management/domain/evento-auditoria.js'
import { exigirPermisoEnTransaccion } from '../../identity-access-management/infrastructure/exigir-permiso-en-transaccion.js'
import { insertarAuditoria } from '../../identity-access-management/infrastructure/insertar-auditoria.js'
import { fechaCMS, idCMS } from '../domain/cms-values.js'
import type { EstadoCMS, DestinoCMS } from '../domain/cms-values.js'

export type TxCms = Prisma.TransactionClient
export type ContextoCms = Readonly<{ actorId: string; cuando: Date; ipAddress?: string | null; userAgent?: string | null }>
export type RecursoCms = 'tipos-seccion' | 'contenidos-seccion' | 'metadata-seccion' | 'menus' | 'items-menu' |
  'elementos-footer' | 'configuracion-sitio' | 'pasos-wizard' | 'registros-cms' | 'contenidos-registro'

export function transaccionCms<T>(db: PrismaClient, tarea: (tx: TxCms) => Promise<T>): Promise<T> {
  return db.$transaction(tarea, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable })
}
export async function gestionarCms(tx: TxCms, contexto: ContextoCms, recurso: RecursoCms): Promise<void> {
  fechaCMS(contexto.cuando)
  await exigirPermisoEnTransaccion(tx, contexto.actorId, `cms.${recurso.replaceAll('-', '_')}.manage`)
}
export function paginaCms(q: { limite?: number; desplazamiento?: number }): { take: number; skip: number } {
  const take = q.limite ?? 100, skip = q.desplazamiento ?? 0
  if (!Number.isSafeInteger(take) || take < 1 || take > 200 || !Number.isSafeInteger(skip) || skip < 0 || skip > 1000000) throw new Error('Paginación inválida')
  return { take, skip }
}
export function filtroEstadoCms(q: { estado?: EstadoCMS; incluirEliminados?: boolean }): { estado?: EstadoCMS; eliminadoEn?: null } {
  if (q.estado !== undefined && !['activo', 'inactivo', 'eliminado'].includes(q.estado)) throw new Error('Estado inválido')
  return { estado: q.estado, ...(q.incluirEliminados === true ? {} : { eliminadoEn: null }) }
}
export function idConfiguracionCms(id: number): number {
  if (!Number.isSafeInteger(id) || id <= 0) throw new Error('ID integer positivo requerido')
  return id
}
export function cambioCms(anterior: Date | null, nuevo: Date | null, contexto: ContextoCms): void {
  if (anterior !== null) fechaCMS(anterior)
  if (nuevo === null || fechaCMS(nuevo).getTime() !== fechaCMS(contexto.cuando).getTime() ||
    (anterior !== null && nuevo <= anterior)) throw new Error('La versión nueva debe avanzar y coincidir con cuando')
}
export function mismoCms(a: unknown, b: unknown): boolean {
  return a instanceof Date && b instanceof Date ? a.getTime() === b.getTime() : a === b
}
export async function empresaCms(tx: TxCms, empresaId: bigint, activo: boolean): Promise<void> {
  if (!await tx.empresa.findFirst({ where: { id: idCMS(empresaId), eliminadoEn: null, ...(activo ? { estado: 'activo' } : {}) }, select: { id: true } })) throw new Error('Empresa no disponible')
}
export async function destinoDisponibleCms(tx: TxCms, empresaId: bigint, destino: DestinoCMS, activo: boolean): Promise<void> {
  const where = { id: idCMS(destino.id), empresaId: idCMS(empresaId), eliminadoEn: null, ...(activo ? { estado: 'activo' as const } : {}) }
  const fila = destino.tipo === 'producto' ? await tx.producto.findFirst({ where, select: { id: true } }) :
    destino.tipo === 'industria' ? await tx.industria.findFirst({ where, select: { id: true } }) :
    await tx.servicio.findFirst({ where, select: { id: true } })
  if (!fila) throw new Error('Destino no disponible o de otra empresa')
}
export async function auditarCms(tx: TxCms, contexto: ContextoCms, recurso: RecursoCms, tabla: string,
  id: bigint | number, anterior: { estado?: string; activo?: boolean | null } | null,
  nuevo: { estado?: string; activo?: boolean | null }): Promise<void> {
  // Registrar estado e identidad; no almacenar texto libre, configuración o metadata sensible.
  const resumen = (fila: typeof nuevo): Json => fila.estado !== undefined ? { estado: fila.estado } : { activo: fila.activo ?? null }
  await insertarAuditoria(tx, EventoAuditoria.registrar({ usuarioId: contexto.actorId,
    accion: anterior === null ? 'Creación' : nuevo.estado === 'eliminado' ? 'Eliminación' : 'Edición',
    tablaAfectada: tabla, registroId: id.toString(), datosAnteriores: anterior === null ? null : resumen(anterior),
    datosNuevos: resumen(nuevo), ipAddress: contexto.ipAddress ?? null, userAgent: contexto.userAgent ?? null,
    metadata: { operacion: `cms.${recurso.replaceAll('-', '_')}.manage` }, creadoEn: contexto.cuando }))
}
export function jsonObjetoCms(valor: unknown): Prisma.InputJsonObject {
  // Los mappers/constructores validan y clonan el JSON antes de llegar aquí.
  return valor as Prisma.InputJsonObject
}
