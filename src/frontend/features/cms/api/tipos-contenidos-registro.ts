import type { RegistroBaseCms, IdCms, CamposCms } from './modelos-cms'
export type CrearContenidoRegistro = { empresaId: IdCms; registroId: IdCms; campos: CamposCms & { stats: string | null }; orden: number }
export type EditarContenidoRegistro = Pick<CrearContenidoRegistro, 'campos'>
export type ContenidoRegistroDto = RegistroBaseCms & CrearContenidoRegistro & { id: string; estado: 'activo' | 'inactivo' | 'eliminado'; creadoEn: string; actualizadoEn: string; eliminadoEn: string | null }
