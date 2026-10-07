import { booleanoCms, submenuCms } from '../../validaciones-cms.js'
import { idCMS } from '../../../domain/cms-values.js'
import { RutaInterna } from '../../../domain/cms-values.js'
import { grupoMenu, validarReferenciaGrupoMenu, iconoLucideMenu, type ReferenciaMenu } from '../../../domain/menu-values.js'
import type { CargarSubmenu } from '../../../domain/menu.js'

export type DatosCrearMenu = Readonly<{ empresaId: bigint; grupo: string; destino: ReferenciaMenu; ruta: string; icono: string | null; mostrar: boolean; orden?: number | null; cargarSubmenu: CargarSubmenu }>
export type DatosEditarMenu = Readonly<{ grupo: string; ruta: string; icono: string | null; mostrar: boolean; cargarSubmenu: CargarSubmenu; destino?: ReferenciaMenu }>

export function normalizarCrearMenu(datos: DatosCrearMenu) {
  return { empresaId: idCMS(datos.empresaId), grupo: grupoMenu(datos.grupo), destino: validarReferenciaGrupoMenu(grupoMenu(datos.grupo),datos.destino), ruta: RutaInterna.create(datos.ruta), icono: iconoLucideMenu(datos.icono), mostrar: booleanoCms(datos.mostrar), cargarSubmenu: submenuCms(datos.cargarSubmenu) }
}

export function normalizarEditarMenu(datos: DatosEditarMenu) {
  return { grupo: grupoMenu(datos.grupo), ...(datos.destino ? {destino: validarReferenciaGrupoMenu(grupoMenu(datos.grupo),datos.destino)} : {}), ruta: RutaInterna.create(datos.ruta), icono: iconoLucideMenu(datos.icono), mostrar: booleanoCms(datos.mostrar), cargarSubmenu: submenuCms(datos.cargarSubmenu) }
}
