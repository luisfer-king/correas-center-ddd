import * as S from './esquemas-cms.js'

const crearTipoSeccionBase = S.objetoCms({ nombre: S.textoObligatorioSchemaCms, slug: S.textoObligatorioSchemaCms, descripcion: S.textoNullableSchemaCms, camposMetadata: { type: 'array', uniqueItems: true, items: S.textoObligatorioSchemaCms }, icono: S.textoNullableSchemaCms, orden: S.nullableCms(S.ordenSchemaCms) })
export const crearTipoSeccionSchema = { ...crearTipoSeccionBase, required: crearTipoSeccionBase.required.filter(c => !['slug', 'camposMetadata', 'orden'].includes(c)) }
export const editarTipoSeccionSchema = S.objetoCms({ version: S.versionSchemaCms, nombre: S.textoObligatorioSchemaCms, descripcion: S.textoNullableSchemaCms, icono: S.textoNullableSchemaCms })
export const salidaTipoSeccionSchema = S.objetoCms({ id: S.idSchemaCms, nombre: S.textoObligatorioSchemaCms, slug: S.textoObligatorioSchemaCms, descripcion: S.textoNullableSchemaCms, camposMetadata: { type: 'array', uniqueItems: true, items: S.textoObligatorioSchemaCms }, icono: S.textoNullableSchemaCms, orden: S.ordenSchemaCms, estado: S.estadoSchemaCms, creadoEn: S.versionSchemaCms, actualizadoEn: S.versionSchemaCms, eliminadoEn: S.nullableCms(S.versionSchemaCms) })
