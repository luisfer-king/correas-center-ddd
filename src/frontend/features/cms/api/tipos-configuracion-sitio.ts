import type { RegistroBaseCms, IdCms } from './modelos-cms'
export type CrearConfiguracionSitio = { empresaId: IdCms | null; clave: string; valor: string | null; tipo: string | null; descripcion: string | null; grupo: string | null; activo: boolean | null }
export type EditarConfiguracionSitio = Pick<CrearConfiguracionSitio, 'valor' | 'tipo' | 'descripcion' | 'grupo'>
export type ConfiguracionSitioDto = RegistroBaseCms & CrearConfiguracionSitio & { id: number }
