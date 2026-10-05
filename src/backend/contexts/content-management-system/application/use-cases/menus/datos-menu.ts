import { textoCms, textoNullableCms, booleanoCms, ordenCms, destinoEntradaCms, submenuCms } from '../../validaciones-cms.js'
import { idCMS } from '../../../domain/cms-values.js'
import { RutaInterna } from '../../../domain/cms-values.js'
import type { DestinoCMS } from '../../../domain/cms-values.js'
import type { CargarSubmenu } from '../../../domain/menu.js'

export type DatosCrearMenu = Readonly<{ empresaId: bigint; grupo: string; destino: DestinoCMS; ruta: string; icono: string | null; mostrar: boolean; orden: number; cargarSubmenu: CargarSubmenu }>
export type DatosEditarMenu = Readonly<{ grupo: string; ruta: string; icono: string | null; mostrar: boolean; cargarSubmenu: CargarSubmenu }>

export function normalizarCrearMenu(datos: DatosCrearMenu) {
  return { empresaId: idCMS(datos.empresaId), grupo: textoCms(datos.grupo, 'Grupo'), destino: destinoEntradaCms(datos.destino), ruta: RutaInterna.create(datos.ruta), icono: textoNullableCms(datos.icono), mostrar: booleanoCms(datos.mostrar), orden: ordenCms(datos.orden), cargarSubmenu: submenuCms(datos.cargarSubmenu) }
}

export function normalizarEditarMenu(datos: DatosEditarMenu) {
  return { grupo: textoCms(datos.grupo, 'Grupo'), ruta: RutaInterna.create(datos.ruta), icono: textoNullableCms(datos.icono), mostrar: booleanoCms(datos.mostrar), cargarSubmenu: submenuCms(datos.cargarSubmenu) }
}
