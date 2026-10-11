import type { DatoTecnico } from '../domain/valor-tecnico.js'
import { cuerpo,id } from './esquemas-catalogo.js'
import { version,parametrosGama,valorNullable } from './esquemas-gamas.js'
import { baseGamas,opcionesGamas,actorHttp,bigintHttp,edicionHttp,type ContextoGamas } from './http-gamas.js'
import { dtoEscritura } from './salidas/gama.js'
export function rutasValoresGama(c:ContextoGamas) {
 c.app.put<{Params:{gamaId:string};Body:{version:string;cambios:{filaId:string;columnaId:string;valor:DatoTecnico|null}[]}}>(`${baseGamas}/:gamaId/valores`,opcionesGamas(c,'Guardar o quitar celdas en una transacción',parametrosGama,cuerpo({version,cambios:{type:'array',minItems:1,maxItems:1000,items:cuerpo({filaId:id,columnaId:id,valor:valorNullable})}})),async(req,reply)=>{
  const actor=await actorHttp(c,req,reply);if(!actor)return reply
  return dtoEscritura(await c.casos.valores.guardar.ejecutar(actor,edicionHttp(req.params.gamaId,req.body.version),req.body.cambios.map(v=>({...v,filaId:bigintHttp(v.filaId),columnaId:bigintHttp(v.columnaId)}))))
 })
}
