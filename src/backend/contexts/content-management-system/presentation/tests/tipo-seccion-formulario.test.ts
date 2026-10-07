import { test } from 'node:test'
import assert from 'node:assert/strict'
import { servidorCms, escritura } from './soporte-http-cms.js'
const datos={nombre:'Nuestra Infraestructura',descripcion:null,icono:'Building2'}
const base='/api/portal/cms/tipos-seccion'
test('Crear genera slug, metadata opcional vacía y orden automático',async t=>{
 const {app,env}=await servidorCms();t.after(()=>app.close());env.tablas.tipoSeccion[0].orden=30
 const r=await app.inject({method:'POST',url:base,headers:escritura,payload:datos})
 assert.equal(r.statusCode,201,r.body);assert.equal(r.json().slug,'nuestra-infraestructura');assert.deepEqual(r.json().camposMetadata,[]);assert.equal(r.json().orden,31);assert.equal(r.json().icono,'Building2')
 assert.equal(env.consultas.filter(c=>c.metodo==='aggregate').length,1)
})
test('Slug deriva del nombre aunque se envíe otro; orden manual cero válido',async t=>{
 const {app,env}=await servidorCms();t.after(()=>app.close())
 const r=await app.inject({method:'POST',url:base,headers:escritura,payload:{...datos,nombre:'Áreas & Servicios',slug:'otro-slug',orden:0,camposMetadata:['badge_text','cta_primary_text']}})
 assert.equal(r.statusCode,201,r.body);assert.equal(r.json().slug,'areas-servicios');assert.equal(r.json().orden,0);assert.deepEqual(r.json().camposMetadata,['badge_text','cta_primary_text']);assert.equal(env.consultas.filter(c=>c.metodo==='aggregate').length,0)
})
test('Orden automático ignora eliminados e incluye inactivos',async t=>{
 const {app,env}=await servidorCms();t.after(()=>app.close());env.tablas.tipoSeccion[0].orden=40;env.tablas.tipoSeccion[0].estado='inactivo'
 env.tablas.tipoSeccion.push({...env.tablas.tipoSeccion[0],id:3n,slug:'eliminado',orden:999,estado:'eliminado',eliminadoEn:new Date()})
 const r=await app.inject({method:'POST',url:base,headers:escritura,payload:{...datos,orden:null}})
 assert.equal(r.statusCode,201,r.body);assert.equal(r.json().orden,41)
})
test('Primer tipo orden cero y desbordamiento integer bloqueado',async t=>{
 const {app,env}=await servidorCms();t.after(()=>app.close());env.tablas.tipoSeccion.length=0
 let r=await app.inject({method:'POST',url:base,headers:escritura,payload:datos});assert.equal(r.statusCode,201,r.body);assert.equal(r.json().orden,0)
 env.tablas.tipoSeccion[0].orden=2147483647
 r=await app.inject({method:'POST',url:base,headers:escritura,payload:{...datos,nombre:'Otro tipo'}});assert.equal(r.statusCode,400,r.body);assert.equal(env.tablas.tipoSeccion.length,1)
})
test('Denegación impide calcular orden; rechaza duplicados y nombres sin slug',async t=>{
 const {app,env}=await servidorCms();t.after(()=>app.close())
 for(const payload of [{...datos,camposMetadata:['cta','cta']},{...datos,nombre:'😀'}])assert.equal((await app.inject({method:'POST',url:base,headers:escritura,payload})).statusCode,400)
 env.opciones.permiso=false
 const r=await app.inject({method:'POST',url:base,headers:escritura,payload:datos});assert.equal(r.statusCode,403);assert.equal(env.consultas.filter(c=>c.metodo==='aggregate'||c.metodo==='create').length,0)
})
