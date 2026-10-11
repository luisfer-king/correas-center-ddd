import type { RegistroBaseCms, IdCms } from './modelos-cms'
export type CrearPasoWizard = { empresaId: IdCms; identificador: string; titulo: string; descripcion: string; fuenteDatos: string; campoFiltro: string | null }
export type EditarPasoWizard = Pick<CrearPasoWizard, 'titulo' | 'descripcion' | 'fuenteDatos' | 'campoFiltro'>
export type PasoWizardDto = RegistroBaseCms & CrearPasoWizard & { id: string; orden: number; estado: 'activo' | 'inactivo' | 'eliminado'; creadoEn: string; actualizadoEn: string; eliminadoEn: string | null }
