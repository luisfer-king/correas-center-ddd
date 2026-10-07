import { clienteRecursoCms } from './operaciones-cms'
import type { VersionCms } from './modelos-cms'
import type { TipoSeccionDto, CrearTipoSeccion, EditarTipoSeccion } from './tipos-tipos-seccion'
const base = clienteRecursoCms<TipoSeccionDto, CrearTipoSeccion, EditarTipoSeccion>('tipos-seccion', false)
export const tipos_seccionApi = { ...base,
activar: (id: string, version: VersionCms) => base.accion(id, version, 'activar'),
inactivar: (id: string, version: VersionCms) => base.accion(id, version, 'inactivar'),
eliminar: (id: string, version: VersionCms) => base.accion(id, version, 'eliminar'),
reordenar: (id: string, version: VersionCms, orden: number) => base.accion(id, version, 'reordenar', { orden }),
cambiarClaves: (id: string, version: VersionCms, claves: string[]) => base.accion(id, version, 'claves', { claves }),
}
