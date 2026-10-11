import type { FastifyInstance, FastifyRequest } from 'fastify'
import type { CasosIam } from '../../identity-access-management/infrastructure/componer-iam.js'
import { exigirOrigen, exigirSesion, type SeguridadIam } from '../../identity-access-management/presentation/seguridad-http.js'
import type { componerGamas } from '../infrastructure/componer-gamas.js'
import { idGama } from '../domain/gama-values.js'
import { salidaEscritura } from './esquemas-salidas-gamas.js'
import { errores } from './esquemas-catalogo.js'
export type CasosGamas = ReturnType<typeof componerGamas>
export type ContextoGamas = {app:FastifyInstance;casos:CasosGamas;iam:CasosIam;config:SeguridadIam}
export type LecturaGamas = {ejecutar(actor:string,recurso:'gamas'|'plantillas-gama',id?:string|null):Promise<void>}
const actores=new WeakMap<FastifyRequest,string>()
export const baseGamas='/api/portal/catalogo/gamas'
export const bigintHttp=(valor:string)=>idGama(BigInt(valor))
export const fechaHttp=(valor:string)=>{
 const fecha=new Date(valor)
 if (!Number.isFinite(fecha.getTime()) || fecha.toISOString()!==valor) throw Object.assign(new Error('Versión inválida'),{statusCode:400})
 return fecha
}
export const edicionHttp=(gamaId:string,version:string)=>({gamaId:bigintHttp(gamaId),version:fechaHttp(version)})
/** Rechaza coerciones de JSON y campos desconocidos antes de que AJV los transforme. */
type Esquema={type?:string;nullable?:boolean;enum?:unknown[];anyOf?:Esquema[];properties?:Record<string,Esquema>;items?:Esquema}
function tiposExactos(s:Esquema,v:unknown):boolean {
 if(v===null)return s.nullable===true || s.type==='null' || !!s.anyOf?.some(x=>tiposExactos(x,v))
 if(s.anyOf)return s.anyOf.some(x=>tiposExactos(x,v))
 if(s.enum && !s.enum.includes(v))return false
 if(s.type==='object')return typeof v==='object' && !Array.isArray(v) && Object.entries(v as object).every(([k,x])=>!!s.properties?.[k] && tiposExactos(s.properties[k],x))
 if(s.type==='array')return Array.isArray(v) && v.every(x=>!s.items || tiposExactos(s.items,x))
 if(s.type==='integer')return typeof v==='number' && Number.isInteger(v)
 return !s.type || typeof v===s.type
}
export async function validarJsonExacto(req:FastifyRequest) {
 if(req.body!==undefined && req.routeOptions.schema?.body && !tiposExactos(req.routeOptions.schema.body as Esquema,req.body))throw Object.assign(new Error('Solicitud inválida'),{statusCode:400})
}
export function opcionesGamas(c:ContextoGamas,summary:string,params?:object,body?:object,status=200,response:object=salidaEscritura,querystring?:object) {
 const sesion=exigirSesion(c.iam,c.config),origen=exigirOrigen(c.config)
 return {onRequest:async(req:FastifyRequest,reply:import('fastify').FastifyReply)=>{
   if(body) {await origen(req,reply);if(reply.sent)return}
   const actor=await sesion(req,reply);if(actor)actores.set(req,actor)
 },preValidation:validarJsonExacto,schema:{tags:['Catálogo · Gamas'],summary,security:[{cookieAuth:[]}],...(params?{params}:{}),...(body?{body}:{}),...(querystring?{querystring}:{}),response:{[status]:response,...errores}}}
}
export async function actorHttp(c:ContextoGamas,req:FastifyRequest,reply:import('fastify').FastifyReply) {
 return actores.get(req) ?? exigirSesion(c.iam,c.config)(req,reply)
}
