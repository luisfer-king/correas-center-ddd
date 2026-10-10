import type { RegistroBaseCms, IdCms, CamposCms } from './modelos-cms'
export type CamposRegistroEntrada = Omit<CamposCms,'subtitulo'> & {subtitulo?:string|null}
export type CrearContenidoRegistro = {empresaId:IdCms;registroId:IdCms;campos:CamposRegistroEntrada}
export type EditarContenidoRegistro = {campos:CamposRegistroEntrada}
export type ContenidoRegistroDto = RegistroBaseCms & {id:string;empresaId:IdCms;registroId:IdCms;campos:CamposCms;orden:number;estado:'activo'|'inactivo'|'eliminado';creadoEn:string;actualizadoEn:string;eliminadoEn:string|null}
