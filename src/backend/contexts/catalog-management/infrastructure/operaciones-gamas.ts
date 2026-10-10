import type { TxCatalogo } from './operaciones-catalogo.js'
import { referenciaActiva, versionCatalogo } from './operaciones-catalogo.js'
import { idGama, ordenGama } from '../domain/gama-values.js'
import type { TipoDatoAtributo } from '../domain/valor-tecnico.js'
import type { GamaCompleta } from '../application/ports/repositorio-gamas.js'
import { aGamaCategoria, datosGamaCategoria } from './mappers/gama-categoria.js'
import { aGrupoColumnaGama, datosGrupoColumnaGama } from './mappers/grupo-columna-gama.js'
import { aGrupoFilaGama, datosGrupoFilaGama } from './mappers/grupo-fila-gama.js'
import { aColumnaGama, datosColumnaGama } from './mappers/columna-gama.js'
import { aFilaGama, datosFilaGama } from './mappers/fila-gama.js'
import { aValorGama } from './mappers/valor-gama.js'
import { EventoAuditoria } from '../../identity-access-management/domain/evento-auditoria.js'
import { insertarAuditoria } from '../../identity-access-management/infrastructure/insertar-auditoria.js'
import type { Json } from '../../identity-access-management/domain/iam-values.js'
export function nuevaVersionGama(anterior: Date): Date { return new Date(Math.max(Date.now(), versionCatalogo(anterior).getTime() + 1)) }
export function comprobarEntidadGama(e: { id: bigint; gamaId: bigint; actualizadoEn: Date }, gamaId: bigint, cuando: Date): void {
  idGama(e.id)
  if (e.gamaId !== gamaId) throw new Error('Elemento ajeno a la gama')
  if (e.actualizadoEn > cuando) throw new Error('Fecha posterior a la transacción')
}
export function validarPermutacion(ids: readonly bigint[], actuales: readonly { id: bigint; orden: number }[]): number {
  const permitidos = new Set(actuales.map(e => e.id))
  if (ids.length !== actuales.length || new Set(ids).size !== ids.length || ids.some(id => !permitidos.has(idGama(id)))) throw new Error('Reordenación debe incluir todos los elementos vigentes una sola vez')
  const maximo = actuales.reduce((m,e) => Math.max(m,e.orden),0)
  if (ids.length) ordenGama(maximo + ids.length)
  return maximo
}
export async function referenciaColumna(tx: TxCatalogo, atributoId: bigint, tipoDato: TipoDatoAtributo): Promise<void> {
  const atributo = await tx.atributoTecnico.findFirst({ where: { id: idGama(atributoId), estado: 'activo', eliminadoEn: null, tipoDato, tipoAtributo: { estado: 'activo', eliminadoEn: null } }, select: { id: true } })
  if (!atributo) throw new Error('Atributo no disponible o tipo incompatible')
}
export async function referenciaGrupo(tx: TxCatalogo, tipo: 'columna' | 'fila', gamaId: bigint, grupoId: bigint | null): Promise<void> {
  if (grupoId === null) return
  const where = { id: idGama(grupoId), gamaId, estado: { not: 'eliminado' as const } }
  const grupo = tipo === 'columna' ? await tx.grupoColumnaGama.findFirst({ where, select: { id: true } }) : await tx.grupoFilaGama.findFirst({ where, select: { id: true } })
  if (!grupo) throw new Error('Grupo no disponible en la gama')
}
export async function bloquearGama(tx: TxCatalogo, gamaId: bigint): Promise<void> {
  await tx.$queryRaw`SELECT id FROM public.gamas_categoria WHERE id = ${idGama(gamaId)} FOR UPDATE`
}
export async function cargarGama(tx: TxCatalogo, id: bigint): Promise<GamaCompleta | null> {
  const f = await tx.gamaCategoria.findUnique({ where: { id: idGama(id) } })
  if (!f) return null
  const where = { gamaId: id }, orderBy = [{ orden: 'asc' as const }, { id: 'asc' as const }]
  const [gc,gf,c,fi,v] = await Promise.all([
    tx.grupoColumnaGama.findMany({ where, orderBy }), tx.grupoFilaGama.findMany({ where, orderBy }),
    tx.columnaGama.findMany({ where, orderBy }), tx.filaGama.findMany({ where, orderBy }),
    tx.valorGama.findMany({ where, orderBy: [{ filaId: 'asc' }, { columnaId: 'asc' }] })
  ])
  const gama = aGamaCategoria(f), estructura = { gruposColumnas: gc.map(aGrupoColumnaGama), gruposFilas: gf.map(aGrupoFilaGama), columnas: c.map(aColumnaGama), filas: fi.map(aFilaGama), valores: v.map(aValorGama) }
  gama.validarEstructura(estructura)
  return { gama, estructura }
}
export function visibilidadGama(datos: GamaCompleta | null, incluir: boolean): GamaCompleta | null {
  if (!datos || (!incluir && datos.gama.estado === 'eliminado')) return null
  if (incluir) return datos
  const e = datos.estructura, columnas = e.columnas.filter(c => c.estado !== 'eliminado'), filas = e.filas.filter(f => f.estado !== 'eliminado')
  return { gama: datos.gama, estructura: { gruposColumnas: e.gruposColumnas.filter(g => g.estado !== 'eliminado'), gruposFilas: e.gruposFilas.filter(g => g.estado !== 'eliminado'), columnas, filas, valores: e.valores.filter(v => filas.some(f => f.id === v.filaId) && columnas.some(c => c.id === v.columnaId)) } }
}
export async function validarReferenciasGama(tx: TxCatalogo, d: GamaCompleta): Promise<void> {
  const g = d.gama, e = d.estructura
  await referenciaActiva(tx, 'categoria', g.categoriaId); await referenciaActiva(tx, 'producto', g.productoId)
  if (g.estado !== 'activo' && await tx.plantillaGamaProducto.count({ where: { gamaId: g.id } })) throw new Error('Retira o cambia la plantilla antes de inactivar/eliminar la gama')
  for (const c of e.columnas.filter(c => c.estado !== 'eliminado')) await referenciaGrupo(tx,'columna',g.id,c.presentacion.grupoId)
  for (const f of e.filas.filter(f => f.estado !== 'eliminado')) await referenciaGrupo(tx,'fila',g.id,f.detalle.grupoId)
}
export function jsonGama(d: GamaCompleta): Json {
  const g=d.gama,e=d.estructura
  return jsonSeguro({ id:g.id,categoriaId:g.categoriaId,productoId:g.productoId,gamaOrigenId:g.gamaOrigenId,...datosGamaCategoria(g),
    gruposColumnas:e.gruposColumnas.map(v=>({id:v.id,...datosGrupoColumnaGama(v)})), gruposFilas:e.gruposFilas.map(v=>({id:v.id,...datosGrupoFilaGama(v)})),
    columnas:e.columnas.map(v=>({id:v.id,...datosColumnaGama(v)})), filas:e.filas.map(v=>({id:v.id,...datosFilaGama(v)})),
    valores:e.valores.map(v=>({filaId:v.filaId,columnaId:v.columnaId,...v.valor.datos})) })
}
export function jsonSeguro(valor: unknown): Json { return JSON.parse(JSON.stringify(valor, (_clave,v: unknown)=> typeof v === 'bigint' ? v.toString() : v)) as Json }
export async function auditarGama(tx: TxCatalogo, actorId: string, tabla: string, id: bigint, anterior: Json, nuevo: Json, eliminado = false): Promise<void> {
  await insertarAuditoria(tx,EventoAuditoria.registrar({ usuarioId:actorId,accion:anterior===null?'Creación':eliminado?'Eliminación':'Edición',tablaAfectada:tabla,registroId:id.toString(),datosAnteriores:anterior,datosNuevos:nuevo,ipAddress:null,userAgent:null,metadata:{operacion:'catalog.categorias.manage'},creadoEn:new Date() }))
}
