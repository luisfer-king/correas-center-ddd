import { salidaConsultaPlantilla,salidaPlantilla } from './esquemas-salidas-gamas.js'
import type { OpcionesCopiaGama } from '../application/copiar-estructura-gama.js'
import { cuerpo,id,ok } from './esquemas-catalogo.js'
import { version,camposCopia } from './esquemas-gamas.js'
import { baseGamas,opcionesGamas,actorHttp,bigintHttp,fechaHttp,type ContextoGamas,type LecturaGamas } from './http-gamas.js'
import { dtoPlantilla,dtoEscritura } from './salidas/gama.js'
export function rutasPlantillasGama(c:ContextoGamas,lectura:LecturaGamas) {
 const base='/api/portal/catalogo/productos/:productoId/plantilla-gama',params=cuerpo({productoId:id}),{app,casos}=c
 app.get<{Params:{productoId:string}}>(base,opcionesGamas(c,'Consultar referencia de plantilla',params,undefined,200,salidaConsultaPlantilla),async(req,reply)=>{
  const actor=await actorHttp(c,req,reply);if(!actor)return reply
  const dato=await casos.plantillas.obtener.ejecutar(actor,bigintHttp(req.params.productoId))
  await lectura.ejecutar(actor,'plantillas-gama',req.params.productoId)
  return {plantilla:dato?dtoPlantilla(dato):null}
 })
 app.put<{Params:{productoId:string};Body:{gamaId:string;version:string|null}}>(base,opcionesGamas(c,'Seleccionar o reemplazar referencia',params,cuerpo({gamaId:id,version:{...version,nullable:true}}),200,salidaPlantilla),async(req,reply)=>{
  const actor=await actorHttp(c,req,reply);if(!actor)return reply
  return dtoPlantilla(await casos.plantillas.seleccionar.ejecutar(actor,bigintHttp(req.params.productoId),bigintHttp(req.body.gamaId),req.body.version===null?null:fechaHttp(req.body.version)))
 })
 app.delete<{Params:{productoId:string};Body:{version:string}}>(base,opcionesGamas(c,'Retirar referencia sin eliminar la gama',params,cuerpo({version}),200,ok),async(req,reply)=>{
  const actor=await actorHttp(c,req,reply);if(!actor)return reply
  await casos.plantillas.quitar.ejecutar(actor,bigintHttp(req.params.productoId),fechaHttp(req.body.version));return {ok:true}
 })
 app.post<{Body:OpcionesCopiaGama & {categoriaId:string;titulo?:string}}>(`${baseGamas}/desde-plantilla`,opcionesGamas(c,'Copiar plantilla a una categoría',undefined,cuerpo({categoriaId:id,...camposCopia},['categoriaId']),201),async(req,reply)=>{
  const actor=await actorHttp(c,req,reply);if(!actor)return reply
  return reply.code(201).send(dtoEscritura(await casos.plantillas.copiar.ejecutar(actor,bigintHttp(req.body.categoriaId),req.body)))
 })
 app.post<{Body:OpcionesCopiaGama & {categoriaId:string;origenId:string;versionOrigen:string;titulo?:string}}>(`${baseGamas}/copiar`,opcionesGamas(c,'Copiar una gama específica',undefined,cuerpo({categoriaId:id,origenId:id,versionOrigen:version,...camposCopia},['categoriaId','origenId','versionOrigen']),201),async(req,reply)=>{
  const actor=await actorHttp(c,req,reply);if(!actor)return reply
  return reply.code(201).send(dtoEscritura(await casos.plantillas.copiarDesdeGama.ejecutar(actor,{...req.body,categoriaId:bigintHttp(req.body.categoriaId),origenId:bigintHttp(req.body.origenId),versionOrigen:fechaHttp(req.body.versionOrigen)})))
 })
}
