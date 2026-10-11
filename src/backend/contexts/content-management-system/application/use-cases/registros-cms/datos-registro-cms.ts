import { textoCms, textoNullableCms } from '../../validaciones-cms.js'

export type DatosCrearRegistroCMS = Readonly<{ identificador: string; nombre: string; descripcion: string | null; orden?: number }>
export type DatosEditarRegistroCMS = Readonly<{ nombre: string; descripcion: string | null }>

export function normalizarCrearRegistroCMS(datos: DatosCrearRegistroCMS) {
  return { identificador: textoCms(datos.identificador, 'Identificador'), nombre: textoCms(datos.nombre, 'Nombre'), descripcion: textoNullableCms(datos.descripcion) }
}

export function normalizarEditarRegistroCMS(datos: DatosEditarRegistroCMS) {
  return { nombre: textoCms(datos.nombre, 'Nombre'), descripcion: textoNullableCms(datos.descripcion) }
}
