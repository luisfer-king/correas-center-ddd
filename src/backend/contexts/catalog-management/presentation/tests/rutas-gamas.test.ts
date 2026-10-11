import assert from 'node:assert/strict'
import { test } from 'node:test'
import Fastify from 'fastify'
import cookie from '@fastify/cookie'
import swagger from '@fastify/swagger'
import type { CasosIam } from '../../../identity-access-management/infrastructure/componer-iam.js'
import type { CasosGamas } from '../http-gamas.js'
import { registrarRutasGamas } from '../registrar-rutas-gamas.js'
import { GamaCategoria } from '../../domain/gama-categoria.js'
const version='2026-10-10T12:00:00.000Z',actor='11111111-1111-4111-8111-111111111111'
const origen='http://localhost:3000',headers={cookie:'portal=valida',origin:origen,'x-portal-request':'1'}
const base='/api/portal/catalogo/gamas'
async function preparar() {
 const llamadas:{nombre:string;args:unknown[]}[]=[],lecturas:unknown[][]=[]
 let error:Error|undefined
 const caso=(nombre:string,resultado:unknown={gamaId:9007199254740993n,version:new Date(version),resultado:5n})=>({ejecutar:async(...args:unknown[])=>{if(error)throw error;llamadas.push({nombre,args});return resultado}})
 const gama=new GamaCategoria({id:9007199254740993n,categoriaId:2n,productoId:1n,gamaOrigenId:null,titulo:'Gama',descripcion:null,imagen:null,estado:'activo',fechas:{creadoEn:new Date(version),actualizadoEn:new Date(version),eliminadoEn:null}})
 const completo={gama,estructura:{gruposColumnas:[],gruposFilas:[],columnas:[],filas:[],valores:[]}}
 const casos={gamas:{crear:caso('crear'),editar:caso('editar'),activar:caso('activar'),inactivar:caso('inactivar'),eliminar:caso('eliminar'),obtener:caso('obtener',completo),porCategoria:caso('porCategoria',null),listar:caso('listar',[gama])},
 plantillas:{obtener:caso('plantilla',null),seleccionar:caso('seleccionar',{productoId:1n,gamaId:2n,creadoEn:new Date(version),actualizadoEn:new Date(version)}),quitar:caso('quitar'),copiar:caso('copiar'),copiarDesdeGama:caso('copiarDesdeGama')},valores:{guardar:caso('guardar')},
 ...Object.fromEntries(['gruposColumnas','gruposFilas','columnas','filas'].map(recurso=>[recurso,Object.fromEntries(['crear','editar','activar','inactivar','eliminar','reordenar','mover'].map(nombre=>[nombre,caso(`${recurso}.${nombre}`)]))])),
 registrarLectura:{ejecutar:async(...args:unknown[])=>{lecturas.push(args)}}} as unknown as CasosGamas
 const iam={comprobar:{ejecutar:async(token:string)=>{if(token!=='valida')throw new Error('Sesión inválida');return {usuarioId:actor}}}} as unknown as CasosIam
 const app=Fastify();await app.register(swagger,{openapi:{info:{title:'Pruebas',version:'1'},components:{securitySchemes:{cookieAuth:{type:'apiKey',in:'cookie',name:'portal'}}}}});await app.register(cookie)
 await app.register(async scope=>registrarRutasGamas(scope,casos,iam,{origen,cookie:'portal',secure:false}));await app.ready()
 return {app,llamadas,lecturas,fallar:(e:Error|undefined)=>{error=e}}
}
test('API gamas: sesión, origen, JSON estricto, IDs y fechas exactas',async()=>{
 const t=await preparar();try {
  assert.equal((await t.app.inject({url:base+'?productoId=1'})).statusCode,401)
  assert.equal((await t.app.inject({method:'POST',url:base,headers:{...headers,origin:'https://otro.test'},payload:{categoriaId:'1',titulo:'A'}})).statusCode,403)
  for(const payload of [{categoriaId:1,titulo:'A'},{categoriaId:'1',titulo:'A',actor:'otro'},{categoriaId:'9223372036854775808',titulo:'A'}])assert.equal((await t.app.inject({method:'POST',url:base,headers,payload})).statusCode,400)
  for(const v of [undefined,'ayer','2026-02-30T12:00:00.000Z'])assert.equal((await t.app.inject({method:'PATCH',url:base+'/1/activar',headers,payload:{version:v}})).statusCode,400)
  assert.equal(t.llamadas.length,0)
  const r=await t.app.inject({method:'POST',url:base,headers,payload:{categoriaId:'9007199254740993',titulo:'A'}})
  assert.equal(r.statusCode,201);assert.equal(r.json().gamaId,'9007199254740993');assert.equal(r.json().version,version)
  assert.equal((t.llamadas[0]!.args[1] as {categoriaId:bigint}).categoriaId,9007199254740993n)
  assert.equal(t.llamadas[0]!.args[0],actor)
 }finally{await t.app.close()}
})
test('API gamas: lecturas serializan getters, ausencia 404 y referencia null; Swagger 42 operaciones',async()=>{
 const t=await preparar();try {
  const r=await t.app.inject({url:base+'/9007199254740993',headers});assert.equal(r.statusCode,200)
  assert.equal(r.json().titulo,'Gama');assert.equal(r.json().version,version);assert.equal(r.json()._titulo,undefined)
  assert.equal((await t.app.inject({url:'/api/portal/catalogo/categorias/2/gama',headers})).statusCode,404)
  assert.deepEqual((await t.app.inject({url:'/api/portal/catalogo/productos/1/plantilla-gama',headers})).json(),{plantilla:null})
  assert.equal(t.lecturas.length,2)
  const spec=t.app.swagger() as {paths:Record<string,Record<string,unknown>>}
  assert.equal(Object.values(spec.paths).reduce((n,p)=>n+Object.keys(p).filter(k=>['get','post','put','patch','delete'].includes(k)).length,0),42)
 }finally{await t.app.close()}
})
test('API gamas: las 28 operaciones de hijos conservan gama, versión, ID y recurso',async()=>{
 const t=await preparar();try {
  for(const [ruta,ns] of [['grupos-columnas','gruposColumnas'],['grupos-filas','gruposFilas'],['columnas','columnas'],['filas','filas']]){
   const b=`${base}/10/${ruta}`, grupo={codigo:'grupo',nombre:'Grupo'},columna={atributoId:'9',tipoDato:'numero',grupoId:null,etiqueta:null,unidadMedida:null},fila={codigo:'fila',grupoId:null,nombre:'Fila',descripcion:null,enlaceDetalle:null}
   const crear=ruta!.startsWith('grupos')?grupo:ruta==='columnas'?columna:fila
   const editar=ruta!.startsWith('grupos')?{nombre:'Otro'}:ruta==='columnas'?{grupoId:'3',etiqueta:null,unidadMedida:null}:{grupoId:null,nombre:'Otra',descripcion:null,enlaceDetalle:null}
   assert.equal((await t.app.inject({method:'POST',url:b,headers,payload:{version,...crear}})).statusCode,201)
   assert.equal((await t.app.inject({method:'PATCH',url:b+'/2',headers,payload:{version,...editar}})).statusCode,200)
   for(const accion of ['activar','inactivar','eliminar'])assert.equal((await t.app.inject({method:'PATCH',url:b+'/2/'+accion,headers,payload:{version}})).statusCode,200)
   assert.equal((await t.app.inject({method:'PATCH',url:b+'/orden',headers,payload:{version,ids:['2','1']}})).statusCode,200)
   assert.equal((await t.app.inject({method:'PATCH',url:b+'/2/orden',headers,payload:{version,posicion:1}})).statusCode,200)
   const llamadas=t.llamadas.filter(l=>l.nombre.startsWith(ns+'.'));assert.equal(llamadas.length,7)
   for(const llamada of llamadas)assert.deepEqual(llamada.args[1],{gamaId:10n,version:new Date(version)})
  }
 }finally{await t.app.close()}
})
test('API gamas: celdas no convierten false, cero ni decimales y rechazan coerciones',async()=>{
 const t=await preparar();try {
  for(const valor of [{tipo:'booleano',valor:false},{tipo:'numero',valor:'0'},{tipo:'numero',valor:'12345678901234567890.123456789'},{tipo:'texto',valor:''},null]){
   const r=await t.app.inject({method:'PUT',url:base+'/1/valores',headers,payload:{version,cambios:[{filaId:'2',columnaId:'3',valor}]}})
   assert.equal(r.statusCode,200,r.body);assert.deepEqual((t.llamadas.at(-1)!.args[2] as {valor:unknown}[])[0]!.valor,valor)
  }
  for(const valor of [{tipo:'booleano',valor:'false'},{tipo:'numero',valor:1},{tipo:'texto',valor:false},{tipo:'numero',valor:'1e4'}])assert.equal((await t.app.inject({method:'PUT',url:base+'/1/valores',headers,payload:{version,cambios:[{filaId:'2',columnaId:'3',valor}]}})).statusCode,400)
 }finally{await t.app.close()}
})
test('API gamas: traducción de errores y detalles internos ocultos',async()=>{
 const t=await preparar();try {
  for(const [mensaje,estado] of [['Acceso denegado',403],['Gama no disponible',404],['Gama modificada por otra operación',409],['Retira o cambia la plantilla antes de quitar su última columna activa',409],['Celda duplicada en la operación',400],['database password secreto',500]] as const){
   t.fallar(new Error(mensaje));const r=await t.app.inject({url:base+'/1',headers});assert.equal(r.statusCode,estado)
   if(estado===500)assert.deepEqual(r.json(),{error:'Error interno'})
  }
 }finally{await t.app.close()}
})
test('API plantillas: selección, retirada y ambas copias preservan versiones y opciones',async()=>{
 const t=await preparar();try {
  const ruta='/api/portal/catalogo/productos/1/plantilla-gama'
  let r=await t.app.inject({method:'PUT',url:ruta,headers,payload:{gamaId:'2',version:null}})
  assert.equal(r.statusCode,200);assert.equal(r.json().gamaId,'2');assert.equal(t.llamadas.at(-1)!.args[3],null)
  r=await t.app.inject({method:'PUT',url:ruta,headers,payload:{gamaId:'2',version}});assert.equal(r.statusCode,200);assert.deepEqual(t.llamadas.at(-1)!.args[3],new Date(version))
  r=await t.app.inject({method:'DELETE',url:ruta,headers,payload:{version}});assert.equal(r.statusCode,200);assert.deepEqual(r.json(),{ok:true})
  r=await t.app.inject({method:'POST',url:base+'/desde-plantilla',headers,payload:{categoriaId:'3',copiarFilas:true,copiarValores:true,copiarEnlaces:false}});assert.equal(r.statusCode,201);assert.equal(t.llamadas.at(-1)!.nombre,'copiar')
  r=await t.app.inject({method:'POST',url:base+'/copiar',headers,payload:{categoriaId:'4',origenId:'2',versionOrigen:version}});assert.equal(r.statusCode,201)
  assert.deepEqual(t.llamadas.at(-1)!.args[1],{categoriaId:4n,origenId:2n,versionOrigen:new Date(version)})
  r=await t.app.inject({method:'POST',url:base+'/desde-plantilla',headers,payload:{categoriaId:'3',copiarFilas:'false'}});assert.equal(r.statusCode,400)
 }finally{await t.app.close()}
})
