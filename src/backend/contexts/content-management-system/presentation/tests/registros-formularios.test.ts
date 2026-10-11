import assert from 'node:assert/strict'
import {test} from 'node:test'
import {servidorCms,escritura} from './soporte-http-cms.js'
test('HTTP registro: crea sin enviar orden',async t=>{
 const {app,env}=await servidorCms('registroCMS');t.after(()=>app.close());env.tablas.registroCMS=[]
 const r=await app.inject({method:'POST',url:'/api/portal/cms/registros-cms',headers:escritura,payload:{identificador:'about_us',nombre:'Quiénes somos',descripcion:null}})
 assert.equal(r.statusCode,201,r.body);assert.equal(r.json().orden,1);assert.equal(r.json().identificador,'about_us')
})
for(const subtitulo of [undefined,'','   '])test(`HTTP contenido: subtítulo ${JSON.stringify(subtitulo)} se guarda null y no expone stats`,async t=>{
 const {app,env}=await servidorCms('contenidoRegistro');t.after(()=>app.close());env.tablas.contenidoRegistro=[]
 const r=await app.inject({method:'POST',url:'/api/portal/cms/contenidos-registro',headers:escritura,payload:{empresaId:'1',registroId:'1',campos:{titulo:'Planta',descripcion:null,icono:'fa-building',...(subtitulo===undefined?{}:{subtitulo})}}})
 assert.equal(r.statusCode,201,r.body);assert.equal(r.json().orden,1);assert.equal(r.json().campos.subtitulo,null)
 assert.ok(!Object.hasOwn(r.json().campos,'stats'));assert.ok(!Object.hasOwn(env.tablas.contenidoRegistro[0],'stats'))
})
test('HTTP contenido: contrato rechaza el campo retirado y edición admite subtítulo omitido',async t=>{
 const {app,env}=await servidorCms('contenidoRegistro');t.after(()=>app.close())
 const base='/api/portal/cms/contenidos-registro',campos={titulo:'Planta',descripcion:null,icono:null}
 let r=await app.inject({method:'POST',url:base,headers:escritura,payload:{empresaId:'1',registroId:'1',campos:{...campos,stats:'25+'}}})
 assert.equal(r.statusCode,400,r.body)
 r=await app.inject({method:'PATCH',url:base+'/2',headers:escritura,payload:{version:env.fila().actualizadoEn.toISOString(),campos}})
 assert.equal(r.statusCode,200,r.body);assert.equal(r.json().campos.subtitulo,null)
})
test('HTTP contenido: listado solicitado por padre devuelve únicamente sus hijos',async t=>{
 const {app,env}=await servidorCms('contenidoRegistro');t.after(()=>app.close())
 env.tablas.contenidoRegistro.push({...env.fila(),id:3n,registroId:2n})
 const r=await app.inject({method:'GET',url:'/api/portal/cms/contenidos-registro?registroId=1',headers:escritura})
 assert.equal(r.statusCode,200,r.body);assert.equal(r.json().length,1);assert.equal(r.json()[0].registroId,'1')
})
