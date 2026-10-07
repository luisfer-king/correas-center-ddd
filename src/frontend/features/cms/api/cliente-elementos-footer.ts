import { clienteRecursoCms } from './operaciones-cms'
import type { VersionCms } from './modelos-cms'
import type { FooterElementoDto, CrearFooterElemento, EditarFooterElemento } from './tipos-elementos-footer'
const base = clienteRecursoCms<FooterElementoDto, CrearFooterElemento, EditarFooterElemento>('elementos-footer', false)
export const elementos_footerApi = { ...base,
activar: (id: string, version: VersionCms) => base.accion(id, version, 'activar'),
inactivar: (id: string, version: VersionCms) => base.accion(id, version, 'inactivar'),
eliminar: (id: string, version: VersionCms) => base.accion(id, version, 'eliminar'),
reordenar: (id: string, version: VersionCms, orden: number) => base.accion(id, version, 'reordenar', { orden }),
fijarVisibilidad: (id: string, version: VersionCms, mostrar: boolean) => base.accion(id, version, 'visibilidad', { mostrar }),
}
