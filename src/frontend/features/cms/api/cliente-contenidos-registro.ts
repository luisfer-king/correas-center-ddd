import { clienteRecursoCms } from './operaciones-cms'
import type { VersionCms } from './modelos-cms'
import type { ContenidoRegistroDto, CrearContenidoRegistro, EditarContenidoRegistro } from './tipos-contenidos-registro'
const base = clienteRecursoCms<ContenidoRegistroDto, CrearContenidoRegistro, EditarContenidoRegistro>('contenidos-registro', false)
export const contenidos_registroApi = { ...base,
activar: (id: string, version: VersionCms) => base.accion(id, version, 'activar'),
inactivar: (id: string, version: VersionCms) => base.accion(id, version, 'inactivar'),
eliminar: (id: string, version: VersionCms) => base.accion(id, version, 'eliminar'),
reordenar: (id: string, version: VersionCms, orden: number) => base.accion(id, version, 'reordenar', { orden }),
}
