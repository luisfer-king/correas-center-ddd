import { textoCms } from '../../validaciones-cms.js'
import { idCMS } from '../../../domain/cms-values.js'
export type DatosCrearMenuItem = Readonly<{ menuId: bigint; nombre: string; categoriaId: bigint; ruta?: string; orden?: number }>
export type DatosEditarMenuItem = Readonly<{ nombre: string; categoriaId?: bigint | null; ruta?: string }>
export function normalizarCrearMenuItem(d: DatosCrearMenuItem) { return { menuId:idCMS(d.menuId),nombre:textoCms(d.nombre,'Nombre'),categoriaId:idCMS(d.categoriaId) } }
export function normalizarEditarMenuItem(d: DatosEditarMenuItem) { return { nombre:textoCms(d.nombre,'Nombre'),categoriaId:d.categoriaId === undefined || d.categoriaId === null ? d.categoriaId : idCMS(d.categoriaId) } }
