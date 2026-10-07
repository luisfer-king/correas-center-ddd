import { textoNullableCms, ordenCms } from '../../validaciones-cms.js'
import { idCMS } from '../../../domain/cms-values.js'
import type { CamposContenidoRegistro } from '../../../domain/contenido-registro.js'

function camposRegistro(campos: CamposContenidoRegistro): CamposContenidoRegistro {
  if (!campos || typeof campos !== 'object') throw new Error('Campos inválidos')
  return { titulo: textoNullableCms(campos.titulo), subtitulo: textoNullableCms(campos.subtitulo), descripcion: textoNullableCms(campos.descripcion), icono: textoNullableCms(campos.icono), stats: textoNullableCms(campos.stats) }
}

export type DatosCrearContenidoRegistro = Readonly<{ empresaId: bigint; registroId: bigint; campos: CamposContenidoRegistro; orden: number }>
export type DatosEditarContenidoRegistro = Readonly<{ campos: CamposContenidoRegistro }>

export function normalizarCrearContenidoRegistro(datos: DatosCrearContenidoRegistro) {
  return { empresaId: idCMS(datos.empresaId), registroId: idCMS(datos.registroId), campos: camposRegistro(datos.campos), orden: ordenCms(datos.orden) }
}

export function normalizarEditarContenidoRegistro(datos: DatosEditarContenidoRegistro) {
  return { campos: camposRegistro(datos.campos) }
}
