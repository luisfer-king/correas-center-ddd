import { clienteRecursoCms } from './operaciones-cms'
import type { VersionCms } from './modelos-cms'
import type { ConfiguracionSitioDto, CrearConfiguracionSitio, EditarConfiguracionSitio } from './tipos-configuracion-sitio'
const base = clienteRecursoCms<ConfiguracionSitioDto, CrearConfiguracionSitio, EditarConfiguracionSitio>('configuracion-sitio', true)
export const configuracion_sitioApi = { ...base,
cambiarActividad: (id: number, version: VersionCms, activo: boolean) => base.accion(id, version, 'actividad', { activo }),
}
