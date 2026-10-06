import { clienteRecursoCms } from './operaciones-cms'
import type { VersionCms } from './modelos-cms'
import type { MenuItemDto, CrearMenuItem, EditarMenuItem } from './tipos-items-menu'
const base = clienteRecursoCms<MenuItemDto, CrearMenuItem, EditarMenuItem>('items-menu', false)
export const items_menuApi = { ...base,
activar: (id: string, version: VersionCms) => base.accion(id, version, 'activar'),
inactivar: (id: string, version: VersionCms) => base.accion(id, version, 'inactivar'),
eliminar: (id: string, version: VersionCms) => base.accion(id, version, 'eliminar'),
reordenar: (id: string, version: VersionCms, orden: number) => base.accion(id, version, 'reordenar', { orden }),
}
