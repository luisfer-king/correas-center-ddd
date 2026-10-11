import * as S from './esquemas-cms.js'

const crear = S.objetoCms({ empresaId: S.idSchemaCms, identificador: S.textoObligatorioSchemaCms, titulo: S.textoObligatorioSchemaCms, descripcion: S.textoObligatorioSchemaCms, fuenteDatos: S.textoObligatorioSchemaCms, campoFiltro: S.textoNullableSchemaCms, orden: S.ordenSchemaCms })
const editar = S.objetoCms({ version: S.versionSchemaCms, titulo: S.textoObligatorioSchemaCms, descripcion: S.textoObligatorioSchemaCms, fuenteDatos: S.textoObligatorioSchemaCms, campoFiltro: S.textoNullableSchemaCms })
export const salidaPasoWizardSchema = S.objetoCms({ id: S.idSchemaCms, empresaId: S.idSchemaCms, identificador: S.textoObligatorioSchemaCms, titulo: S.textoObligatorioSchemaCms, descripcion: S.textoObligatorioSchemaCms, fuenteDatos: S.textoObligatorioSchemaCms, campoFiltro: S.textoNullableSchemaCms, orden: S.ordenSchemaCms, estado: S.estadoSchemaCms, creadoEn: S.versionSchemaCms, actualizadoEn: S.versionSchemaCms, eliminadoEn: S.nullableCms(S.versionSchemaCms) })

export const crearPasoWizardSchema = { ...crear, required: crear.required.filter(c => c !== "orden" && c !== "campoFiltro") }
export const editarPasoWizardSchema = { ...editar, required: editar.required.filter(c => c !== "campoFiltro") }
