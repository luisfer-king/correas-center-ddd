import { textoNullableCms } from '../../validaciones-cms.js'
import { idCMS } from '../../../domain/cms-values.js'
import type { CamposContenidoRegistro } from '../../../domain/contenido-registro.js'
export type CamposEntradaRegistro = Omit<CamposContenidoRegistro,'subtitulo'> & {subtitulo?:string|null}
function camposRegistro(campos: CamposEntradaRegistro): CamposContenidoRegistro {
  if (!campos || typeof campos !== 'object') throw new Error('Campos inválidos')
  const subtitulo=textoNullableCms(campos.subtitulo??null)
  return {titulo:textoNullableCms(campos.titulo),subtitulo:subtitulo?.trim()||null,descripcion:textoNullableCms(campos.descripcion),icono:textoNullableCms(campos.icono)}
}
export type DatosCrearContenidoRegistro = Readonly<{empresaId:bigint;registroId:bigint;campos:CamposEntradaRegistro;orden?:number}>
export type DatosEditarContenidoRegistro = Readonly<{campos:CamposEntradaRegistro}>
export function normalizarCrearContenidoRegistro(datos:DatosCrearContenidoRegistro){
  return {empresaId:idCMS(datos.empresaId),registroId:idCMS(datos.registroId),campos:camposRegistro(datos.campos)}
}
export function normalizarEditarContenidoRegistro(datos:DatosEditarContenidoRegistro){return {campos:camposRegistro(datos.campos)}}
