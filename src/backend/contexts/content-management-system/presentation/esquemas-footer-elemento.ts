import * as S from './esquemas-cms.js'
const opcionales={destino:S.nullableCms(S.destinoSchemaCms),titulo:S.textoNullableSchemaCms,enlace:S.textoNullableSchemaCms,icono:S.textoNullableSchemaCms}
const tipo={type:'string',enum:['producto','industria','servicio','red_social']}
const crear=S.objetoCms({empresaId:S.idSchemaCms,tipo,mostrar:{type:'boolean'}})
export const crearFooterElementoSchema={...crear,properties:{...crear.properties,...opcionales,orden:S.ordenSchemaCms}}
const editar=S.objetoCms({version:S.versionSchemaCms,mostrar:{type:'boolean'}})
export const editarFooterElementoSchema={...editar,properties:{...editar.properties,...opcionales}}
export const salidaFooterElementoSchema=S.objetoCms({id:S.idSchemaCms,empresaId:S.idSchemaCms,tipo,...opcionales,orden:S.ordenSchemaCms,mostrar:{type:'boolean'},estado:S.estadoSchemaCms,creadoEn:S.versionSchemaCms,actualizadoEn:S.versionSchemaCms,eliminadoEn:S.nullableCms(S.versionSchemaCms)})
