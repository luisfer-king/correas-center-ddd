import { textoCms, textoNullableCms, booleanoCms } from '../../validaciones-cms.js'
import { idCMS } from '../../../domain/cms-values.js'

export type DatosCrearConfiguracionSitio = Readonly<{ empresaId: bigint | null; clave: string; valor: string | null; tipo: string | null; descripcion: string | null; grupo: string | null; activo: boolean | null }>
export type DatosEditarConfiguracionSitio = Readonly<{ valor: string | null; tipo: string | null; descripcion: string | null; grupo: string | null }>

export function normalizarCrearConfiguracionSitio(datos: DatosCrearConfiguracionSitio) {
  return { empresaId: datos.empresaId === null ? null : idCMS(datos.empresaId), clave: textoCms(datos.clave, 'Clave'), valor: textoNullableCms(datos.valor), tipo: datos.tipo === null ? null : textoCms(datos.tipo, 'Tipo'), descripcion: textoNullableCms(datos.descripcion), grupo: textoNullableCms(datos.grupo), activo: datos.activo === null ? null : booleanoCms(datos.activo) }
}

export function normalizarEditarConfiguracionSitio(datos: DatosEditarConfiguracionSitio) {
  return { valor: textoNullableCms(datos.valor), tipo: datos.tipo === null ? null : textoCms(datos.tipo, 'Tipo'), descripcion: textoNullableCms(datos.descripcion), grupo: textoNullableCms(datos.grupo) }
}
