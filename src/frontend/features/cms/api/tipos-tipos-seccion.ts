import type { RegistroBaseCms } from './modelos-cms'
export type CrearTipoSeccion = { nombre: string; slug: string; descripcion: string | null; camposMetadata: string[]; icono: string | null; orden: number }
export type EditarTipoSeccion = Pick<CrearTipoSeccion, 'nombre' | 'descripcion' | 'icono'>
export type TipoSeccionDto = RegistroBaseCms & CrearTipoSeccion & { id: string; estado: 'activo' | 'inactivo' | 'eliminado'; creadoEn: string; actualizadoEn: string; eliminadoEn: string | null }
