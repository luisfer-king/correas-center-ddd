import type { TipoDatoAtributo } from '../domain/valor-tecnico.js'
import { cuerpo,id } from './esquemas-catalogo.js'
import { camposColumna,tipoDato,version,parametrosGama,parametrosElemento,soloVersion,idsOrdenados,posicion } from './esquemas-gamas.js'
import { baseGamas,opcionesGamas,actorHttp,bigintHttp,edicionHttp,type ContextoGamas } from './http-gamas.js'
import { dtoEscritura } from './salidas/gama.js'
type Crear = {atributoId:string;tipoDato:TipoDatoAtributo;grupoId:string|null;etiqueta:string|null;unidadMedida:string|null}
type Editar = {grupoId:string|null;etiqueta:string|null;unidadMedida:string|null}
export function rutasColumnasGama(c:ContextoGamas) {
 const {app,casos}=c, recurso=casos.columnas,base=`${baseGamas}/:gamaId/columnas`
 app.post<{Params:{gamaId:string};Body:Crear & {version:string}}>(base,opcionesGamas(c,'Crear columnas',parametrosGama,cuerpo({version,atributoId:id,tipoDato,...camposColumna}),201),async(req,reply)=>{
  const actor=await actorHttp(c,req,reply);if(!actor)return reply
  return reply.code(201).send(dtoEscritura(await recurso.crear.ejecutar(actor,edicionHttp(req.params.gamaId,req.body.version),{...req.body,atributoId:bigintHttp(req.body.atributoId),grupoId:req.body.grupoId===null?null:bigintHttp(req.body.grupoId)})))
 })
 app.patch<{Params:{gamaId:string;id:string};Body:Editar & {version:string}}>(`${base}/:id`,opcionesGamas(c,'Editar columnas',parametrosElemento,cuerpo({version,...camposColumna})),async(req,reply)=>{
  const actor=await actorHttp(c,req,reply);if(!actor)return reply
  return dtoEscritura(await recurso.editar.ejecutar(actor,edicionHttp(req.params.gamaId,req.body.version),bigintHttp(req.params.id),{...req.body,grupoId:req.body.grupoId===null?null:bigintHttp(req.body.grupoId)}))
 })
 app.patch<{Params:{gamaId:string};Body:{version:string;ids:string[]}}>(`${base}/orden`,opcionesGamas(c,'Reordenar columnas',parametrosGama,cuerpo({version,ids:idsOrdenados})),async(req,reply)=>{
  const actor=await actorHttp(c,req,reply);if(!actor)return reply
  return dtoEscritura(await recurso.reordenar.ejecutar(actor,edicionHttp(req.params.gamaId,req.body.version),req.body.ids.map(bigintHttp)))
 })
 app.patch<{Params:{gamaId:string;id:string};Body:{version:string;posicion:number}}>(`${base}/:id/orden`,opcionesGamas(c,'Mover columnas',parametrosElemento,cuerpo({version,posicion})),async(req,reply)=>{
  const actor=await actorHttp(c,req,reply);if(!actor)return reply
  return dtoEscritura(await recurso.mover.ejecutar(actor,edicionHttp(req.params.gamaId,req.body.version),bigintHttp(req.params.id),req.body.posicion))
 })
 for(const accion of ['activar','inactivar','eliminar'] as const)app.patch<{Params:{gamaId:string;id:string};Body:{version:string}}>(`${base}/:id/${accion}`,opcionesGamas(c,`${accion} columnas`,parametrosElemento,soloVersion),async(req,reply)=>{
  const actor=await actorHttp(c,req,reply);if(!actor)return reply
  return dtoEscritura(await recurso[accion].ejecutar(actor,edicionHttp(req.params.gamaId,req.body.version),bigintHttp(req.params.id)))
 })
}
