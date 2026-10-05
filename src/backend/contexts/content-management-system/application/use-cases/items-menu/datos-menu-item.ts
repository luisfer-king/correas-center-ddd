import { ordenCms } from '../../validaciones-cms.js'
import { idCMS } from '../../../domain/cms-values.js'
import { RutaInterna } from '../../../domain/cms-values.js'

export type DatosCrearMenuItem = Readonly<{ menuId: bigint; ruta: string; orden: number }>
export type DatosEditarMenuItem = Readonly<{ ruta: string }>

export function normalizarCrearMenuItem(datos: DatosCrearMenuItem) {
  return { menuId: idCMS(datos.menuId), ruta: RutaInterna.create(datos.ruta), orden: ordenCms(datos.orden) }
}

export function normalizarEditarMenuItem(datos: DatosEditarMenuItem) {
  return { ruta: RutaInterna.create(datos.ruta) }
}
