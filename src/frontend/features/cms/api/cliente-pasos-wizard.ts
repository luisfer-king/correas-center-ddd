import { clienteRecursoCms } from './operaciones-cms'
import type { VersionCms } from './modelos-cms'
import type { PasoWizardDto, CrearPasoWizard, EditarPasoWizard } from './tipos-pasos-wizard'
const base = clienteRecursoCms<PasoWizardDto, CrearPasoWizard, EditarPasoWizard>('pasos-wizard', false)
export const pasos_wizardApi = { ...base,
activar: (id: string, version: VersionCms) => base.accion(id, version, 'activar'),
inactivar: (id: string, version: VersionCms) => base.accion(id, version, 'inactivar'),
eliminar: (id: string, version: VersionCms) => base.accion(id, version, 'eliminar'),
reordenar: (id: string, version: VersionCms, orden: number) => base.accion(id, version, 'reordenar', { orden }),
}
