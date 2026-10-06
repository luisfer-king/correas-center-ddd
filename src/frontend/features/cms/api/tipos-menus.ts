import type { MenuItemDto } from './tipos-items-menu'
import type { RegistroBaseCms, IdCms, DestinoCms } from './modelos-cms'
export type CrearMenu = { empresaId: IdCms; grupo: string; destino: DestinoCms; ruta: string; icono: string | null; mostrar: boolean; orden: number; cargarSubmenu: 'activo' | 'inactivo' | null }
export type EditarMenu = Pick<CrearMenu, 'grupo' | 'ruta' | 'icono' | 'mostrar' | 'cargarSubmenu'>
export type MenuDto = { items: MenuItemDto[] } & RegistroBaseCms & CrearMenu & { id: string; estado: 'activo' | 'inactivo' | 'eliminado'; creadoEn: string; actualizadoEn: string; eliminadoEn: string | null }
