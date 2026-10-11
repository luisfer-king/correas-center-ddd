import { cuerpo } from './esquemas-catalogo.js'
import { camposGrupo,version,parametrosGama,parametrosElemento,soloVersion,idsOrdenados,posicion } from './esquemas-gamas.js'
import { baseGamas,opcionesGamas,actorHttp,bigintHttp,edicionHttp,type ContextoGamas } from './http-gamas.js'
import { dtoEscritura } from './salidas/gama.js'
type Crear = {codigo:string;nombre:string}
type Editar = {nombre:string}
export function rutasGruposFilasGama(c:ContextoGamas) {
 const {app,casos}=c, recurso=casos.gruposFilas,base=`${baseGamas}/:gamaId/grupos-filas`
 app.post<{Params:{gamaId:string};Body:Crear & {version:string}}>(base,opcionesGamas(c,'Crear grupos-filas',parametrosGama,cuerpo({version,...camposGrupo}),201),async(req,reply)=>{
  const actor=await actorHttp(c,req,reply);if(!actor)return reply
  return reply.code(201).send(dtoEscritura(await recurso.crear.ejecutar(actor,edicionHttp(req.params.gamaId,req.body.version),req.body)))
 })
 app.patch<{Params:{gamaId:string;id:string};Body:Editar & {version:string}}>(`${base}/:id`,opcionesGamas(c,'Editar grupos-filas',parametrosElemento,cuerpo({version,nombre:camposGrupo.nombre})),async(req,reply)=>{
  const actor=await actorHttp(c,req,reply);if(!actor)return reply
  return dtoEscritura(await recurso.editar.ejecutar(actor,edicionHttp(req.params.gamaId,req.body.version),bigintHttp(req.params.id),req.body.nombre))
 })
 app.patch<{Params:{gamaId:string};Body:{version:string;ids:string[]}}>(`${base}/orden`,opcionesGamas(c,'Reordenar grupos-filas',parametrosGama,cuerpo({version,ids:idsOrdenados})),async(req,reply)=>{
  const actor=await actorHttp(c,req,reply);if(!actor)return reply
  return dtoEscritura(await recurso.reordenar.ejecutar(actor,edicionHttp(req.params.gamaId,req.body.version),req.body.ids.map(bigintHttp)))
 })
 app.patch<{Params:{gamaId:string;id:string};Body:{version:string;posicion:number}}>(`${base}/:id/orden`,opcionesGamas(c,'Mover grupos-filas',parametrosElemento,cuerpo({version,posicion})),async(req,reply)=>{
  const actor=await actorHttp(c,req,reply);if(!actor)return reply
  return dtoEscritura(await recurso.mover.ejecutar(actor,edicionHttp(req.params.gamaId,req.body.version),bigintHttp(req.params.id),req.body.posicion))
 })
 for(const accion of ['activar','inactivar','eliminar'] as const)app.patch<{Params:{gamaId:string;id:string};Body:{version:string}}>(`${base}/:id/${accion}`,opcionesGamas(c,`${accion} grupos-filas`,parametrosElemento,soloVersion),async(req,reply)=>{
  const actor=await actorHttp(c,req,reply);if(!actor)return reply
  return dtoEscritura(await recurso[accion].ejecutar(actor,edicionHttp(req.params.gamaId,req.body.version),bigintHttp(req.params.id)))
 })
}
