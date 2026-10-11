import { salidaListaGamas,salidaCompleta } from './esquemas-salidas-gamas.js'
import { cuerpo,id,pagina } from './esquemas-catalogo.js'
import { camposGama,version,parametrosGama,soloVersion } from './esquemas-gamas.js'
import { baseGamas,opcionesGamas,actorHttp,bigintHttp,edicionHttp,type ContextoGamas,type LecturaGamas } from './http-gamas.js'
import { dtoGama,dtoGamaCompleta,dtoEscritura } from './salidas/gama.js'
export function rutasGamas(c:ContextoGamas,lectura:LecturaGamas) {
 const {app,casos}=c
 app.get<{Querystring:{productoId:string;pagina?:number}}>(baseGamas,opcionesGamas(c,'Listar gamas del producto',undefined,undefined,200,salidaListaGamas,cuerpo({productoId:id,pagina:pagina.properties.pagina},['productoId'])),async(req,reply)=>{
  const actor=await actorHttp(c,req,reply);if(!actor)return reply
  const datos=await casos.gamas.listar.ejecutar(actor,bigintHttp(req.query.productoId),req.query.pagina??1)
  await lectura.ejecutar(actor,'gamas');return datos.map(dtoGama)
 })
 for(const porCategoria of [false,true]) {
  const ruta=porCategoria?'/api/portal/catalogo/categorias/:id/gama':`${baseGamas}/:id`
  app.get<{Params:{id:string}}>(ruta,opcionesGamas(c,porCategoria?'Consultar gama por categoría':'Consultar gama completa',cuerpo({id}),undefined,200,salidaCompleta),async(req,reply)=>{
   const actor=await actorHttp(c,req,reply);if(!actor)return reply
   const dato=await casos.gamas[porCategoria?'porCategoria':'obtener'].ejecutar(actor,bigintHttp(req.params.id))
   if(!dato)return reply.code(404).send({error:'Gama no disponible'})
   await lectura.ejecutar(actor,'gamas',String(dato.gama.id));return dtoGamaCompleta(dato)
  })
 }
 app.post<{Body:{categoriaId:string;titulo:string;descripcion?:string|null;imagen?:string|null}}>(baseGamas,opcionesGamas(c,'Crear gama',undefined,cuerpo({categoriaId:id,...camposGama},['categoriaId','titulo']),201),async(req,reply)=>{
  const actor=await actorHttp(c,req,reply);if(!actor)return reply
  return reply.code(201).send(dtoEscritura(await casos.gamas.crear.ejecutar(actor,{...req.body,categoriaId:bigintHttp(req.body.categoriaId)})))
 })
 app.patch<{Params:{gamaId:string};Body:{version:string;titulo:string;descripcion:string|null;imagen:string|null}}>(`${baseGamas}/:gamaId`,opcionesGamas(c,'Editar gama',parametrosGama,cuerpo({version,...camposGama})),async(req,reply)=>{
  const actor=await actorHttp(c,req,reply);if(!actor)return reply
  return dtoEscritura(await casos.gamas.editar.ejecutar(actor,edicionHttp(req.params.gamaId,req.body.version),req.body))
 })
 for(const accion of ['activar','inactivar','eliminar'] as const)app.patch<{Params:{gamaId:string};Body:{version:string}}>(`${baseGamas}/:gamaId/${accion}`,opcionesGamas(c,`${accion} gama`,parametrosGama,soloVersion),async(req,reply)=>{
  const actor=await actorHttp(c,req,reply);if(!actor)return reply
  return dtoEscritura(await casos.gamas[accion].ejecutar(actor,edicionHttp(req.params.gamaId,req.body.version)))
 })
}
