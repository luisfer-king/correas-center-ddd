import type { FastifyInstance } from 'fastify'
import type { ContactoPublico,SuscripcionPublica } from '../../../../shared/publico/captacion.js'
import type { RecibirContactoPublico } from '../application/use-cases/publico/recibir-contacto.js'
import type { RecibirSuscripcionPublica } from '../application/use-cases/publico/recibir-suscripcion.js'
import { CaptacionInvalida } from '../application/use-cases/publico/validar-captacion.js'
import { EmpresaNoPublicada } from '../../../shared/application/lectura-publica.js'
const texto=(maxLength:number,minLength=1)=>({type:'string',minLength,maxLength})
const comunes={email:texto(254,3),consentimiento:{type:'boolean',const:true},sitioWeb:texto(200,0)}
export function registrarCaptacionPublica(app:FastifyInstance,contacto:RecibirContactoPublico,suscripcion:RecibirSuscripcionPublica,empresaId:bigint,origen:string){
 function registrar<T>(ruta:string,caso:{ejecutar(id:bigint,d:T):Promise<unknown>},properties:object,required:string[]){
  app.post<{Body:T}>(ruta,{bodyLimit:16384,config:{rateLimit:{max:5,timeWindow:'10 minutes'}},schema:{tags:['CRM público'],security:[],body:{type:'object',additionalProperties:false,properties,required}},onRequest:async(req,reply)=>{
   reply.header('Cache-Control','no-store')
   if(req.headers.origin!==origen||!req.headers['content-type']?.startsWith('application/json'))return reply.code(403).send({error:'Origen o formato no permitido'})
  }},async(req,reply)=>{try{return reply.code(202).send(await caso.ejecutar(empresaId,req.body as T))}catch(e){
   if(e instanceof EmpresaNoPublicada)return reply.code(404).send({error:'Sitio no disponible'})
   if(e instanceof CaptacionInvalida)return reply.code(400).send({error:e.message})
   // No registrar los datos personales enviados por el visitante.
   req.log.error('No se pudo guardar la solicitud pública');return reply.code(500).send({error:'No se pudo guardar tu solicitud. Intenta nuevamente.'})
  }})
 }
 registrar<ContactoPublico>('/api/publico/commercial/contactos',contacto,{...comunes,nombre:texto(120,2),empresaDeclarada:texto(160,0),telefono:texto(40,5),mensaje:texto(5000,10)},['nombre','telefono','email','mensaje','consentimiento'])
 registrar<SuscripcionPublica>('/api/publico/commercial/suscripciones',suscripcion,comunes,['email','consentimiento'])
}
