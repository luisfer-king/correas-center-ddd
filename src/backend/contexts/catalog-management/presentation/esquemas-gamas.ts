import { cuerpo, id } from './esquemas-catalogo.js'
export const version = { type: 'string', format: 'date-time', pattern: '^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3}Z$' }
export const nombre = {type:'string',minLength:1,maxLength:255,pattern:'\\S'}
export const texto = {type:'string',nullable:true,maxLength:100000}
export const enlace = {type:'string',nullable:true,minLength:1,maxLength:2048}
export const codigo = {type:'string',pattern:'^[a-z0-9][a-z0-9_-]{0,79}$'}
export const tipoDato = {type:'string',enum:['texto','numero','booleano']}
export const idNullable = {...id,nullable:true}
export const datoTecnico = {anyOf:[
 cuerpo({tipo:{type:'string',enum:['texto']},valor:{type:'string',maxLength:100000}}),
 cuerpo({tipo:{type:'string',enum:['numero']},valor:{type:'string',pattern:'^-?(?:0|[1-9][0-9]*)(?:\\.[0-9]+)?$',maxLength:1000}}),
 cuerpo({tipo:{type:'string',enum:['booleano']},valor:{type:'boolean'}}),
]}
export const valorNullable = {anyOf:[...datoTecnico.anyOf,{type:'object',nullable:true,enum:[null]}]}
export const camposCopia = {titulo:nombre,copiarFilas:{type:'boolean'},copiarValores:{type:'boolean'},copiarEnlaces:{type:'boolean'}}
export const camposGama = {titulo:nombre,descripcion:texto,imagen:enlace}
export const camposGrupo = {codigo,nombre}
export const camposColumna = {grupoId:idNullable,etiqueta:{type:'string',nullable:true,maxLength:255},unidadMedida:{type:'string',nullable:true,maxLength:80}}
export const camposFila = {grupoId:idNullable,nombre,descripcion:texto,enlaceDetalle:enlace}
export const parametrosGama = cuerpo({gamaId:id})
export const parametrosElemento = cuerpo({gamaId:id,id})
export const soloVersion = cuerpo({version})
export const idsOrdenados = {type:'array',items:id,uniqueItems:true,maxItems:10000}
export const posicion = {type:'integer',minimum:1,maximum:2147483647}
