import type { RegistroBaseCms, IdCms, DestinoCms } from './modelos-cms'
export type TipoFooterFormulario = 'producto' | 'industria' | 'servicio' | 'red_social'
type CamposFooter = { destino?: DestinoCms | null; titulo?: string | null; enlace?: string | null; icono?: string | null; mostrar: boolean }
export type CrearFooterElemento = CamposFooter & { empresaId: IdCms; tipo: TipoFooterFormulario }
export type EditarFooterElemento = CamposFooter
export type FooterElementoDto = RegistroBaseCms & { id: string; empresaId: IdCms; tipo: TipoFooterFormulario; destino: DestinoCms | null; titulo: string | null; enlace: string | null; icono: string | null; orden: number; mostrar: boolean; estado: 'activo'|'inactivo'|'eliminado'; creadoEn: string; actualizadoEn: string; eliminadoEn: string | null }
