import { textoNullableCms, booleanoCms, ordenCms } from '../../validaciones-cms.js'
import { idCMS } from '../../../domain/cms-values.js'
import { metadataSeccion } from '../../../domain/metadata-seccion.js'
import type { CamposContenidoSeccion } from '../../../domain/contenido-seccion.js'

function camposSeccion(campos: CamposContenidoSeccion): CamposContenidoSeccion {
  if (!campos || typeof campos !== 'object') throw new Error('Campos inválidos')
  return { titulo: textoNullableCms(campos.titulo), subtitulo: textoNullableCms(campos.subtitulo), descripcion: textoNullableCms(campos.descripcion), icono: textoNullableCms(campos.icono), imagen: textoNullableCms(campos.imagen) }
}

export type DatosCrearContenidoSeccion = Readonly<{ empresaId: bigint; tipoSeccionId: bigint; campos: CamposContenidoSeccion; metadata: unknown; orden: number; mostrar: boolean }>
export type DatosEditarContenidoSeccion = Readonly<{ campos: CamposContenidoSeccion; metadata: unknown }>

export function normalizarCrearContenidoSeccion(datos: DatosCrearContenidoSeccion) {
  return { empresaId: idCMS(datos.empresaId), tipoSeccionId: idCMS(datos.tipoSeccionId), campos: camposSeccion(datos.campos), metadata: metadataSeccion(datos.metadata), orden: ordenCms(datos.orden), mostrar: booleanoCms(datos.mostrar) }
}

export function normalizarEditarContenidoSeccion(datos: DatosEditarContenidoSeccion) {
  return { campos: camposSeccion(datos.campos), metadata: metadataSeccion(datos.metadata) }
}
