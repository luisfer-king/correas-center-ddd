import * as S from './esquemas-cms.js'
const camposBase=S.objetoCms({titulo:S.textoNullableSchemaCms,descripcion:S.textoNullableSchemaCms,icono:S.textoNullableSchemaCms})
const camposEntrada={...camposBase,properties:{...camposBase.properties,subtitulo:S.textoNullableSchemaCms}}
const camposSalida=S.objetoCms({...camposBase.properties,subtitulo:S.textoNullableSchemaCms})
const crear=S.objetoCms({empresaId:S.idSchemaCms,registroId:S.idSchemaCms,campos:camposEntrada})
export const crearContenidoRegistroSchema={...crear,properties:{...crear.properties,orden:S.ordenSchemaCms}}
export const editarContenidoRegistroSchema=S.objetoCms({version:S.versionSchemaCms,campos:camposEntrada})
export const salidaContenidoRegistroSchema=S.objetoCms({id:S.idSchemaCms,empresaId:S.idSchemaCms,registroId:S.idSchemaCms,campos:camposSalida,orden:S.ordenSchemaCms,estado:S.estadoSchemaCms,creadoEn:S.versionSchemaCms,actualizadoEn:S.versionSchemaCms,eliminadoEn:S.nullableCms(S.versionSchemaCms)})
