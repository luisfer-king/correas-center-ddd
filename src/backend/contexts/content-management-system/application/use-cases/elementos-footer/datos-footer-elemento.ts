import { textoNullableCms, booleanoCms, tipoFooterCms, footerCms } from '../../validaciones-cms.js'
import { idCMS } from '../../../domain/cms-values.js'
import type { DestinoCMS } from '../../../domain/cms-values.js'
import type { TipoFooter } from '../../../domain/footer-elemento.js'
type OpcionalesFooter = { destino?: DestinoCMS | null; titulo?: string | null; enlace?: string | null; icono?: string | null }
export type DatosCrearFooterElemento = Readonly<OpcionalesFooter & { empresaId: bigint; tipo: TipoFooter; orden?: number; mostrar: boolean }>
export type DatosEditarFooterElemento = Readonly<OpcionalesFooter & { mostrar: boolean }>
function opcional(valor: string | null | undefined): string | null {
  if(valor===undefined || valor===null)return null
  const texto=textoNullableCms(valor)!.trim()
  return texto || null
}
function campos(datos: OpcionalesFooter,tipo: TipoFooter) {
  return {...footerCms(tipo,datos.destino??null,opcional(datos.enlace)),titulo:opcional(datos.titulo),icono:opcional(datos.icono)}
}
export function normalizarCrearFooterElemento(datos: DatosCrearFooterElemento) {
  return {empresaId:idCMS(datos.empresaId),tipo:tipoFooterCms(datos.tipo),...campos(datos,datos.tipo),mostrar:booleanoCms(datos.mostrar)}
}
export function normalizarEditarFooterElemento(datos: DatosEditarFooterElemento,tipo: TipoFooter) {
  return {...campos(datos,tipo),mostrar:booleanoCms(datos.mostrar)}
}
