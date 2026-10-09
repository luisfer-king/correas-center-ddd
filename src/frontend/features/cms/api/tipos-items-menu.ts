import type { RegistroBaseCms, IdCms } from './modelos-cms'
export type CrearMenuItem = { menuId: IdCms; nombre: string; categoriaId: IdCms }
export type EditarMenuItem = { nombre: string; categoriaId?: IdCms }
export type MenuItemDto = RegistroBaseCms & { id: string; menuId: IdCms; nombre: string; categoriaId: IdCms | null; ruta: string; orden: number; estado: 'activo' | 'inactivo' | 'eliminado'; creadoEn: string; actualizadoEn: string; eliminadoEn: string | null }
