import * as S from './esquemas-cms.js'
export const crearMenuItemSchema=S.objetoCms({menuId:S.idSchemaCms,nombre:{...S.textoObligatorioSchemaCms,maxLength:255},categoriaId:S.idSchemaCms})
const editar=S.objetoCms({version:S.versionSchemaCms,nombre:{...S.textoObligatorioSchemaCms,maxLength:255}})
export const editarMenuItemSchema={...editar,properties:{...editar.properties,categoriaId:S.idSchemaCms}}
export const salidaMenuItemSchema=S.objetoCms({id:S.idSchemaCms,menuId:S.idSchemaCms,nombre:{...S.textoObligatorioSchemaCms,maxLength:255},categoriaId:S.nullableCms(S.idSchemaCms),ruta:S.textoObligatorioSchemaCms,orden:{...S.ordenSchemaCms,minimum:1},estado:S.estadoSchemaCms,creadoEn:S.versionSchemaCms,actualizadoEn:S.versionSchemaCms,eliminadoEn:S.nullableCms(S.versionSchemaCms)})
