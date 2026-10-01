import { Prisma, type PrismaClient } from '../../../generated/prisma/client.js'
import { EventoAuditoria } from '../../identity-access-management/domain/evento-auditoria.js'
import { exigirPermisoEnTransaccion } from '../../identity-access-management/infrastructure/exigir-permiso-en-transaccion.js'
import { insertarAuditoria } from '../../identity-access-management/infrastructure/insertar-auditoria.js'
import { idCatalogo } from '../domain/catalog-values.js'

export type TxCatalogo = Prisma.TransactionClient
export type RecursoCatalogo = 'productos' | 'categorias' | 'marcas' | 'tipos-atributo' | 'atributos-tecnicos' | 'industrias' | 'servicios' | 'asignaciones-marca' | 'asignaciones-atributo' | 'asignaciones-industria'
export function paginaCatalogo(pagina: number): number {
  if (!Number.isSafeInteger(pagina) || pagina < 1 || pagina > 10000) throw new Error('Página inválida')
  return (pagina - 1) * 100
}
export function versionCatalogo(fecha: Date): Date {
  if (!(fecha instanceof Date) || !Number.isFinite(fecha.getTime())) throw new Error('Versión inválida')
  return fecha
}
export function sinEliminados(incluir: boolean): { eliminadoEn?: null } { return incluir ? {} : { eliminadoEn: null } }
export function sinVinculosEliminados(incluir: boolean): { estado?: { not: 'eliminado' } } {
  return incluir ? {} : { estado: { not: 'eliminado' } }
}
export function transaccionCatalogo<T>(db: PrismaClient, fn: (tx: TxCatalogo) => Promise<T>): Promise<T> {
  return db.$transaction(fn, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable })
}
export async function referenciaActiva(tx: TxCatalogo, tabla: 'empresa' | 'producto' | 'categoria' | 'marca' | 'tipoAtributo' | 'atributoTecnico' | 'industria' | 'servicio', id: bigint): Promise<void> {
  const clave = idCatalogo(id)
  const where = { id: clave, estado: 'activo' as const, eliminadoEn: null }
  // Cada rama mantiene el delegate Prisma tipado y comprueba el estado dentro de la transacción.
  const encontrado = tabla === 'empresa' ? await tx.empresa.findFirst({ where, select: { id: true } })
    : tabla === 'producto' ? await tx.producto.findFirst({ where, select: { id: true } })
    : tabla === 'categoria' ? await tx.categoria.findFirst({ where, select: { id: true } })
    : tabla === 'marca' ? await tx.marca.findFirst({ where, select: { id: true } })
    : tabla === 'tipoAtributo' ? await tx.tipoAtributo.findFirst({ where, select: { id: true } })
    : tabla === 'atributoTecnico' ? await tx.atributoTecnico.findFirst({ where, select: { id: true } })
    : tabla === 'industria' ? await tx.industria.findFirst({ where, select: { id: true } })
    : await tx.servicio.findFirst({ where, select: { id: true } })
  if (!encontrado) throw new Error('Referencia no disponible')
}
export async function permitirCatalogo(tx: TxCatalogo, actorId: string, recurso: RecursoCatalogo): Promise<void> {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(actorId)) throw new Error('Actor inválido')
  await exigirPermisoEnTransaccion(tx, actorId, `catalog.${recurso.replaceAll("-", "_")}.manage`)
}
export async function auditarCatalogo(tx: TxCatalogo, actorId: string, recurso: RecursoCatalogo, id: bigint, anterior: string | null, nuevo: string): Promise<void> {
  await insertarAuditoria(tx, EventoAuditoria.registrar({
    usuarioId: actorId, accion: anterior === null ? 'Creación' : nuevo === 'eliminado' ? 'Eliminación' : 'Edición',
    tablaAfectada: recurso, registroId: id.toString(),
    datosAnteriores: anterior === null ? null : { estado: anterior }, datosNuevos: { estado: nuevo },
    ipAddress: null, userAgent: null, metadata: { operacion: `catalog.${recurso.replaceAll("-", "_")}.manage` }, creadoEn: new Date(),
  }))
}
