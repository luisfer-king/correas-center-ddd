import type { FastifyInstance } from 'fastify'
import type { LeerGamaCategoria } from '../application/use-cases/publico/leer-gama-categoria.js'
import { EmpresaNoPublicada } from '../../../shared/application/lectura-publica.js'
export function registrarGamaPublico(app:FastifyInstance,caso:LeerGamaCategoria,empresaId:bigint) {
 app.get<{Params:{id:string}}>('/api/publico/catalogo/categorias/:id/gama',{config:{rateLimit:{max:120,timeWindow:'1 minute'}},schema:{tags:['CATALOGO público'],summary:'Gama técnica publicada de categoría',security:[],params:{type:'object',additionalProperties:false,required:['id'],properties:{id:{type:'string',pattern:'^[1-9][0-9]{0,18}$'}}}}},async(req,reply)=>{
  reply.header('Cache-Control','no-store')
  try{const g=await caso.ejecutar(empresaId,req.params.id);return g??reply.code(404).send({error:'Gama pública no disponible'})}
  catch(e){if(e instanceof EmpresaNoPublicada)return reply.code(404).send({error:e.message});req.log.error({err:e},'Error en gama pública');return reply.code(500).send({error:'No se pudo consultar la gama pública'})}
 })
}
