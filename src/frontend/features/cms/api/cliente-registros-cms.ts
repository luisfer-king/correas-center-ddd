import { clienteRecursoCms } from './operaciones-cms'
import type { VersionCms } from './modelos-cms'
import type { RegistroCMSDto, CrearRegistroCMS, EditarRegistroCMS } from './tipos-registros-cms'
const base = clienteRecursoCms<RegistroCMSDto, CrearRegistroCMS, EditarRegistroCMS>('registros-cms', false)
export const registros_cmsApi = { ...base,
activar: (id: string, version: VersionCms) => base.accion(id, version, 'activar'),
inactivar: (id: string, version: VersionCms) => base.accion(id, version, 'inactivar'),
eliminar: (id: string, version: VersionCms) => base.accion(id, version, 'eliminar'),
reordenar: (id: string, version: VersionCms, orden: number) => base.accion(id, version, 'reordenar', { orden }),
}
