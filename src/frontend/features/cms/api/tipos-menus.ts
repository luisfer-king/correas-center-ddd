import type { MenuItemDto } from './tipos-items-menu'
import type { RegistroBaseCms, IdCms } from './modelos-cms'
export type CrearMenu = { empresaId: IdCms; grupo: string; destino: { tipo: 'producto' | 'servicio' | 'industria'; id: IdCms }; ruta: string; icono: string | null; mostrar: boolean; orden?: number | null; cargarSubmenu: 'activo' | 'inactivo' | null }
export type EditarMenu = Pick<CrearMenu, 'grupo' | 'ruta' | 'icono' | 'mostrar' | 'cargarSubmenu' | 'destino'>
export type MenuDto = { items: MenuItemDto[] } & RegistroBaseCms & CrearMenu & { destino: NonNullable<CrearMenu['destino']>; orden: number; registroId: string; id: string; estado: 'activo' | 'inactivo' | 'eliminado'; creadoEn: string; actualizadoEn: string; eliminadoEn: string | null }
