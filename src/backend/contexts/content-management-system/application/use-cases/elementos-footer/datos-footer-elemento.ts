import { textoNullableCms, booleanoCms, ordenCms, tipoFooterCms, footerCms } from '../../validaciones-cms.js'
import { idCMS } from '../../../domain/cms-values.js'
import type { DestinoCMS } from '../../../domain/cms-values.js'
import type { TipoFooter } from '../../../domain/footer-elemento.js'

export type DatosCrearFooterElemento = Readonly<{ empresaId: bigint; tipo: TipoFooter; destino: DestinoCMS | null; titulo: string | null; enlace: string | null; icono: string | null; orden: number; mostrar: boolean }>
export type DatosEditarFooterElemento = Readonly<{ destino: DestinoCMS | null; titulo: string | null; enlace: string | null; icono: string | null; mostrar: boolean }>

export function normalizarCrearFooterElemento(datos: DatosCrearFooterElemento) {
  return { empresaId: idCMS(datos.empresaId), tipo: tipoFooterCms(datos.tipo), ...footerCms(datos.tipo, datos.destino, datos.enlace), titulo: textoNullableCms(datos.titulo), icono: textoNullableCms(datos.icono), orden: ordenCms(datos.orden), mostrar: booleanoCms(datos.mostrar) }
}

export function normalizarEditarFooterElemento(datos: DatosEditarFooterElemento, tipo: TipoFooter) {
  return { ...footerCms(tipo, datos.destino, datos.enlace), titulo: textoNullableCms(datos.titulo), icono: textoNullableCms(datos.icono), mostrar: booleanoCms(datos.mostrar) }
}
