import * as S from './esquemas-cms.js'

export const crearRegistroCMSSchema = S.objetoCms({ identificador: S.textoObligatorioSchemaCms, nombre: S.textoObligatorioSchemaCms, descripcion: S.textoNullableSchemaCms, orden: S.ordenSchemaCms })
export const editarRegistroCMSSchema = S.objetoCms({ version: S.versionSchemaCms, nombre: S.textoObligatorioSchemaCms, descripcion: S.textoNullableSchemaCms })
export const salidaRegistroCMSSchema = S.objetoCms({ id: S.idSchemaCms, identificador: S.textoObligatorioSchemaCms, nombre: S.textoObligatorioSchemaCms, descripcion: S.textoNullableSchemaCms, orden: S.ordenSchemaCms, estado: S.estadoSchemaCms, creadoEn: S.versionSchemaCms, actualizadoEn: S.versionSchemaCms, eliminadoEn: S.nullableCms(S.versionSchemaCms) })
