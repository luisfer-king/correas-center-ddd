import { cuerpo } from './esquemas-catalogo.js'
import { camposFila,codigo,version,parametrosGama,parametrosElemento,soloVersion,idsOrdenados,posicion } from './esquemas-gamas.js'
import { baseGamas,opcionesGamas,actorHttp,bigintHttp,edicionHttp,type ContextoGamas } from './http-gamas.js'
import { dtoEscritura } from './salidas/gama.js'
type Crear = {codigo:string;grupoId:string|null;nombre:string;descripcion:string|null;enlaceDetalle:string|null}
type Editar = {grupoId:string|null;nombre:string;descripcion:string|null;enlaceDetalle:string|null}
export function rutasFilasGama(c:ContextoGamas) {
 const {app,casos}=c, recurso=casos.filas,base=`${baseGamas}/:gamaId/filas`
 app.post<{Params:{gamaId:string};Body:Crear & {version:string}}>(base,opcionesGamas(c,'Crear filas',parametrosGama,cuerpo({version,codigo,...camposFila}),201),async(req,reply)=>{
  const actor=await actorHttp(c,req,reply);if(!actor)return reply
  return reply.code(201).send(dtoEscritura(await recurso.crear.ejecutar(actor,edicionHttp(req.params.gamaId,req.body.version),{...req.body,grupoId:req.body.grupoId===null?null:bigintHttp(req.body.grupoId)})))
 })
 app.patch<{Params:{gamaId:string;id:string};Body:Editar & {version:string}}>(`${base}/:id`,opcionesGamas(c,'Editar filas',parametrosElemento,cuerpo({version,...camposFila})),async(req,reply)=>{
  const actor=await actorHttp(c,req,reply);if(!actor)return reply
  return dtoEscritura(await recurso.editar.ejecutar(actor,edicionHttp(req.params.gamaId,req.body.version),bigintHttp(req.params.id),{...req.body,grupoId:req.body.grupoId===null?null:bigintHttp(req.body.grupoId)}))
 })
 app.patch<{Params:{gamaId:string};Body:{version:string;ids:string[]}}>(`${base}/orden`,opcionesGamas(c,'Reordenar filas',parametrosGama,cuerpo({version,ids:idsOrdenados})),async(req,reply)=>{
  const actor=await actorHttp(c,req,reply);if(!actor)return reply
  return dtoEscritura(await recurso.reordenar.ejecutar(actor,edicionHttp(req.params.gamaId,req.body.version),req.body.ids.map(bigintHttp)))
 })
 app.patch<{Params:{gamaId:string;id:string};Body:{version:string;posicion:number}}>(`${base}/:id/orden`,opcionesGamas(c,'Mover filas',parametrosElemento,cuerpo({version,posicion})),async(req,reply)=>{
  const actor=await actorHttp(c,req,reply);if(!actor)return reply
  return dtoEscritura(await recurso.mover.ejecutar(actor,edicionHttp(req.params.gamaId,req.body.version),bigintHttp(req.params.id),req.body.posicion))
 })
 for(const accion of ['activar','inactivar','eliminar'] as const)app.patch<{Params:{gamaId:string;id:string};Body:{version:string}}>(`${base}/:id/${accion}`,opcionesGamas(c,`${accion} filas`,parametrosElemento,soloVersion),async(req,reply)=>{
  const actor=await actorHttp(c,req,reply);if(!actor)return reply
  return dtoEscritura(await recurso[accion].ejecutar(actor,edicionHttp(req.params.gamaId,req.body.version),bigintHttp(req.params.id)))
 })
}
