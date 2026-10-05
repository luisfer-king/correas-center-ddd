import * as S from './esquemas-cms.js'

export const crearMenuItemSchema = S.objetoCms({ menuId: S.idSchemaCms, ruta: S.textoObligatorioSchemaCms, orden: S.ordenSchemaCms })
export const editarMenuItemSchema = S.objetoCms({ version: S.versionSchemaCms, ruta: S.textoObligatorioSchemaCms })
export const salidaMenuItemSchema = S.objetoCms({ id: S.idSchemaCms, menuId: S.idSchemaCms, ruta: S.textoObligatorioSchemaCms, orden: S.ordenSchemaCms, estado: S.estadoSchemaCms, creadoEn: S.versionSchemaCms, actualizadoEn: S.versionSchemaCms, eliminadoEn: S.nullableCms(S.versionSchemaCms) })
