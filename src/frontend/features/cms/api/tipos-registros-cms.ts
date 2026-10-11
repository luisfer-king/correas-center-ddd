import type { RegistroBaseCms } from './modelos-cms'
export type CrearRegistroCMS = { identificador: string; nombre: string; descripcion: string | null }
export type EditarRegistroCMS = Pick<CrearRegistroCMS, 'nombre' | 'descripcion'>
export type RegistroCMSDto = RegistroBaseCms & CrearRegistroCMS & { orden:number; id: string; estado: 'activo' | 'inactivo' | 'eliminado'; creadoEn: string; actualizadoEn: string; eliminadoEn: string | null }
