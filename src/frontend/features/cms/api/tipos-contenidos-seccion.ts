import type { RegistroBaseCms, IdCms, CamposCms } from './modelos-cms'
export type CrearContenidoSeccion = { empresaId: IdCms; tipoSeccionId: IdCms; campos: CamposCms & { imagen: string | null }; metadata: Record<string, unknown>; orden: number; mostrar: boolean }
export type EditarContenidoSeccion = Pick<CrearContenidoSeccion, 'campos' | 'metadata'>
export type ContenidoSeccionDto = RegistroBaseCms & CrearContenidoSeccion & { id: string; estado: 'activo' | 'inactivo' | 'eliminado'; creadoEn: string; actualizadoEn: string; eliminadoEn: string | null }
