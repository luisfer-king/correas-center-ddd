import { fechaCMS, idCMS } from '../domain/cms-values.js'
import type { EstadoCMS } from '../domain/cms-values.js'
import type { AutorizacionCms, ContextoAccionCms } from './seguridad-cms.js'
import { actorCms, verEliminadosCms } from './seguridad-cms.js'
export interface RelojCms { ahora(): Date }

export function idConfiguracionCms(id: number): number {
  if (!Number.isSafeInteger(id) || id < 1 || id > 2147483647) throw new Error('ID integer positivo requerido')
  return id
}
export function contextoEscrituraCms(contexto: ContextoAccionCms, reloj: RelojCms, ...versiones: (Date | null)[]) {
  const ahora = fechaCMS(reloj.ahora()).getTime()
  const minimo = versiones.reduce((max, fecha) => fecha === null ? max : Math.max(max, fechaCMS(fecha).getTime() + 1), ahora)
  return { ...contexto, actorId: actorCms(contexto.actorId), cuando: fechaCMS(new Date(minimo)) }
}
export function exigirVersionCms(actual: Date | null, esperada: Date | null): void {
  if (actual !== null) fechaCMS(actual)
  if (esperada !== null) fechaCMS(esperada)
  if ((actual?.getTime() ?? null) !== (esperada?.getTime() ?? null)) throw new Error('Registro CMS modificado por otra operación')
}
export async function obtenerEditableCms<T extends { estado?: string }>(repo: { obtener(id: bigint): Promise<T | null> }, id: bigint): Promise<T> {
  const entidad = await repo.obtener(idCMS(id))
  if (!entidad || entidad.estado === 'eliminado') throw new Error('Registro CMS no disponible')
  return entidad
}
export async function obtenerVisibleCms<T extends { estado?: string }>(repo: { obtener(id: bigint): Promise<T | null> }, auth: AutorizacionCms, actorId: string, id: bigint): Promise<T> {
  const entidad = await repo.obtener(idCMS(id))
  if (!entidad || (entidad.estado === 'eliminado' && !await verEliminadosCms(auth, actorId))) throw new Error('Registro CMS no disponible')
  return entidad
}
export async function consultaCms<T extends { estado?: EstadoCMS; incluirEliminados?: boolean; limite?: number; desplazamiento?: number }>(auth: AutorizacionCms, actorId: string, consulta: T): Promise<T & { incluirEliminados: boolean; limite: number; desplazamiento: number }> {
  const limite = consulta.limite ?? 100, desplazamiento = consulta.desplazamiento ?? 0
  if (!Number.isSafeInteger(limite) || limite < 1 || limite > 200 || !Number.isSafeInteger(desplazamiento) || desplazamiento < 0 || desplazamiento > 1000000) throw new Error('Paginación inválida')
  if (consulta.estado !== undefined && !['activo', 'inactivo', 'eliminado'].includes(consulta.estado)) throw new Error('Estado inválido')
  if (consulta.incluirEliminados !== undefined && typeof consulta.incluirEliminados !== 'boolean') throw new Error('Visibilidad inválida')
  if ((consulta.incluirEliminados === true || consulta.estado === 'eliminado') && !await verEliminadosCms(auth, actorId)) throw new Error('Acceso denegado para registros eliminados')
  return { ...consulta, incluirEliminados: consulta.incluirEliminados === true || consulta.estado === 'eliminado', limite, desplazamiento }
}
