import { textoCms } from '../../validaciones-cms.js'
import { idCMS } from '../../../domain/cms-values.js'

export type DatosCrearPasoWizard = Readonly<{ empresaId: bigint; identificador: string; titulo: string; descripcion: string; fuenteDatos: string; campoFiltro?: string | null; orden?: number }>
export type DatosEditarPasoWizard = Readonly<{ titulo: string; descripcion: string; fuenteDatos: string; campoFiltro?: string | null }>

export function normalizarCrearPasoWizard(datos: DatosCrearPasoWizard) {
  return { empresaId: idCMS(datos.empresaId), identificador: textoCms(datos.identificador, 'Identificador'), titulo: textoCms(datos.titulo, 'Título'), descripcion: textoCms(datos.descripcion, 'Descripción'), fuenteDatos: textoCms(datos.fuenteDatos, 'Fuente'), campoFiltro: datos.campoFiltro?.trim() ? textoCms(datos.campoFiltro, 'Filtro') : null }
}

export function normalizarEditarPasoWizard(datos: DatosEditarPasoWizard) {
  return { titulo: textoCms(datos.titulo, 'Título'), descripcion: textoCms(datos.descripcion, 'Descripción'), fuenteDatos: textoCms(datos.fuenteDatos, 'Fuente'), campoFiltro: datos.campoFiltro?.trim() ? textoCms(datos.campoFiltro, 'Filtro') : null }
}
