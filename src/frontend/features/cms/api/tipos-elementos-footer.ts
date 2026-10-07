import type { RegistroBaseCms, IdCms, DestinoCms } from './modelos-cms'
export type CrearFooterElemento = { empresaId: IdCms; tipo: 'producto' | 'industria' | 'servicio' | 'red_social'; destino: DestinoCms | null; titulo: string | null; enlace: string | null; icono: string | null; orden: number; mostrar: boolean }
export type EditarFooterElemento = Pick<CrearFooterElemento, 'destino' | 'titulo' | 'enlace' | 'icono' | 'mostrar'>
export type FooterElementoDto = RegistroBaseCms & CrearFooterElemento & { id: string; estado: 'activo' | 'inactivo' | 'eliminado'; creadoEn: string; actualizadoEn: string; eliminadoEn: string | null }
