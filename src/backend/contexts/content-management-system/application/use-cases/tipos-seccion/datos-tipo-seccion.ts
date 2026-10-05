import { textoCms, textoNullableCms, ordenCms } from '../../validaciones-cms.js'
import { Slug } from '../../../../../shared/domain/value-objects.js'
import { camposMetadata } from '../../../domain/metadata-seccion.js'

export type DatosCrearTipoSeccion = Readonly<{ nombre: string; slug: string; descripcion: string | null; camposMetadata: unknown; icono: string | null; orden: number }>
export type DatosEditarTipoSeccion = Readonly<{ nombre: string; descripcion: string | null; icono: string | null }>

export function normalizarCrearTipoSeccion(datos: DatosCrearTipoSeccion) {
  return { nombre: textoCms(datos.nombre, 'Nombre'), slug: Slug.create(datos.slug), descripcion: textoNullableCms(datos.descripcion), camposMetadata: camposMetadata(datos.camposMetadata), icono: textoNullableCms(datos.icono), orden: ordenCms(datos.orden) }
}

export function normalizarEditarTipoSeccion(datos: DatosEditarTipoSeccion) {
  return { nombre: textoCms(datos.nombre, 'Nombre'), descripcion: textoNullableCms(datos.descripcion), icono: textoNullableCms(datos.icono) }
}
