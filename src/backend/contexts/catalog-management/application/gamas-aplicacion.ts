import type { AutorizacionCatalogo } from './acceso-catalogo.js'
import { exigirGestion } from './acceso-catalogo.js'
import type { UnidadTrabajoGamas, SesionGama } from './ports/unidad-trabajo-gamas.js'
import { idGama } from '../domain/gama-values.js'
export type EdicionGama = { gamaId: bigint; version: Date }
export function versionGama(fecha: Date): Date {
  if (!(fecha instanceof Date) || !Number.isFinite(fecha.getTime())) throw new Error('Versión de gama inválida')
  return new Date(fecha)
}
export async function escribirGama<T>(uow: UnidadTrabajoGamas, autorizar: AutorizacionCatalogo, actor: string, edicion: EdicionGama, trabajo: (s: SesionGama)=>Promise<T>, asegurarPrimeraPlantilla=false) {
  await exigirGestion(autorizar,actor,'categorias')
  return uow.editar(idGama(edicion.gamaId),versionGama(edicion.version),actor,trabajo,{asegurarPrimeraPlantilla})
}
export function encontrarElemento<T extends {id:bigint}>(elementos: readonly T[],id:bigint): T {
  const entidad=elementos.find(e=>e.id===idGama(id))
  if (!entidad) throw new Error('Elemento no disponible en la gama')
  return entidad
}
export function moverElemento(elementos: readonly {id:bigint}[],id:bigint,posicion:number): bigint[] {
  encontrarElemento(elementos,id)
  if (!Number.isInteger(posicion) || posicion<1 || posicion>elementos.length) throw new Error('Posición fuera de la gama')
  const ids=elementos.map(e=>e.id).filter(actual=>actual!==id);ids.splice(posicion-1,0,id);return ids
}
