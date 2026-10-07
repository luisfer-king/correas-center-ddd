import type { RegistroBaseCms } from './modelos-cms'
export type CrearRegistroCMS = { identificador: string; nombre: string; descripcion: string | null; orden: number }
export type EditarRegistroCMS = Pick<CrearRegistroCMS, 'nombre' | 'descripcion'>
export type RegistroCMSDto = RegistroBaseCms & CrearRegistroCMS & { id: string; estado: 'activo' | 'inactivo' | 'eliminado'; creadoEn: string; actualizadoEn: string; eliminadoEn: string | null }
