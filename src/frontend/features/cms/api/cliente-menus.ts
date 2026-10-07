import { clienteRecursoCms } from './operaciones-cms'
import type { VersionCms } from './modelos-cms'
import type { MenuDto, CrearMenu, EditarMenu } from './tipos-menus'
const base = clienteRecursoCms<MenuDto, CrearMenu, EditarMenu>('menus', false)
export const menusApi = { ...base,
activar: (id: string, version: VersionCms) => base.accion(id, version, 'activar'),
inactivar: (id: string, version: VersionCms) => base.accion(id, version, 'inactivar'),
eliminar: (id: string, version: VersionCms) => base.accion(id, version, 'eliminar'),
reordenar: (id: string, version: VersionCms, orden: number) => base.accion(id, version, 'reordenar', { orden }),
fijarVisibilidad: (id: string, version: VersionCms, mostrar: boolean) => base.accion(id, version, 'visibilidad', { mostrar }),
}
