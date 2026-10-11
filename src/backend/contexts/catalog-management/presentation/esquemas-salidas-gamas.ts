import { cuerpo,id } from './esquemas-catalogo.js'
import { version,datoTecnico } from './esquemas-gamas.js'
const cadena={type:'string'},nullable={type:'string',nullable:true},fecha={type:'string',format:'date-time'}
const fechas={estado:{type:'string',enum:['activo','inactivo','eliminado']},creadoEn:fecha,actualizadoEn:fecha,eliminadoEn:{...fecha,nullable:true}}
const grupo=cuerpo({id,gamaId:id,codigo:cadena,nombre:cadena,orden:{type:'integer'},...fechas})
const array=(items:object)=>({type:'array',items})
export const salidaGama=cuerpo({id,categoriaId:id,productoId:id,gamaOrigenId:{...id,nullable:true},titulo:cadena,descripcion:nullable,imagen:nullable,...fechas,version})
export const salidaCompleta=cuerpo({...salidaGama.properties,
 gruposColumnas:array(grupo),gruposFilas:array(grupo),
 columnas:array(cuerpo({id,gamaId:id,atributoId:id,tipoDato:{type:'string',enum:['texto','numero','booleano']},grupoId:{...id,nullable:true},etiqueta:nullable,unidadMedida:nullable,orden:{type:'integer'},...fechas})),
 filas:array(cuerpo({id,gamaId:id,codigo:cadena,grupoId:{...id,nullable:true},nombre:cadena,descripcion:nullable,enlaceDetalle:nullable,orden:{type:'integer'},...fechas})),
 valores:array(cuerpo({filaId:id,columnaId:id,gamaId:id,valor:datoTecnico,creadoEn:fecha,actualizadoEn:fecha})),
})
export const salidaPlantilla=cuerpo({productoId:id,gamaId:id,creadoEn:fecha,version})
export const salidaConsultaPlantilla=cuerpo({plantilla:{...salidaPlantilla,nullable:true}})
export const salidaEscritura=cuerpo({gamaId:id,version,resultado:{anyOf:[id,{type:'integer'},array(id),cuerpo({gruposColumnas:{type:'integer'},gruposFilas:{type:'integer'},columnas:{type:'integer'},filas:{type:'integer'},valores:{type:'integer'}})]}})
export const salidaListaGamas=array(salidaGama)
