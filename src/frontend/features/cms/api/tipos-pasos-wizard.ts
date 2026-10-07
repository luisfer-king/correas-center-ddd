import type { RegistroBaseCms, IdCms } from './modelos-cms'
export type CrearPasoWizard = { empresaId: IdCms; identificador: string; titulo: string; descripcion: string; fuenteDatos: string; campoFiltro: string | null; orden: number }
export type EditarPasoWizard = Pick<CrearPasoWizard, 'titulo' | 'descripcion' | 'fuenteDatos' | 'campoFiltro'>
export type PasoWizardDto = RegistroBaseCms & CrearPasoWizard & { id: string; estado: 'activo' | 'inactivo' | 'eliminado'; creadoEn: string; actualizadoEn: string; eliminadoEn: string | null }
