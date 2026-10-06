import type { RegistroBaseCms, IdCms } from './modelos-cms'
export type CrearMenuItem = { menuId: IdCms; ruta: string; orden: number }
export type EditarMenuItem = Pick<CrearMenuItem, 'ruta'>
export type MenuItemDto = RegistroBaseCms & CrearMenuItem & { id: string; estado: 'activo' | 'inactivo' | 'eliminado'; creadoEn: string; actualizadoEn: string; eliminadoEn: string | null }
