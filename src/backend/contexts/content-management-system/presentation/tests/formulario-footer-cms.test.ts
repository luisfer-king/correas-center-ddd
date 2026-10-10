import assert from 'node:assert/strict'
import {test} from 'node:test'
import {servidorCms,escritura} from './soporte-http-cms.js'
const base='/api/portal/cms/elementos-footer'
for(const tipo of ['producto','industria','servicio','red_social'])test(`footer: ${tipo} admite todos los campos opcionales omitidos`,async t=>{
 const {app,env}=await servidorCms('footerElemento');t.after(()=>app.close())
 env.tablas.footerElemento=[]
 const r=await app.inject({method:'POST',url:base,headers:escritura,payload:{empresaId:'1',tipo,mostrar:true}})
 assert.equal(r.statusCode,201,r.body)
 const datos=r.json();assert.equal(datos.orden,1);assert.equal(datos.estado,'activo')
 for(const clave of ['destino','titulo','enlace','icono'])assert.equal(datos[clave],null)
})
test('footer: vacíos se guardan en null; icono Font Awesome conserva sus clases',async t=>{
 const {app,env}=await servidorCms('footerElemento');t.after(()=>app.close())
 let r=await app.inject({method:'POST',url:base,headers:escritura,payload:{empresaId:'1',tipo:'red_social',mostrar:true,titulo:'   ',enlace:'   ',icono:' fab fa-whatsapp '}})
 assert.equal(r.statusCode,201,r.body);assert.equal(r.json().titulo,null);assert.equal(r.json().enlace,null);assert.equal(r.json().icono,'fab fa-whatsapp')
 const creado=env.tablas.footerElemento.find(x=>x.id===99n)!
 r=await app.inject({method:'PATCH',url:base+'/99',headers:escritura,payload:{version:creado.actualizadoEn.toISOString(),mostrar:true,icono:''}})
 assert.equal(r.statusCode,200,r.body);assert.equal(r.json().icono,null);assert.equal(r.json().enlace,null)
})
test('footer: guarda ID real y rechaza destino de otra empresa',async t=>{
 const {app,env}=await servidorCms('footerElemento');t.after(()=>app.close())
 const payload={empresaId:'1',tipo:'producto',destino:{tipo:'producto',id:'1'},mostrar:true}
 let r=await app.inject({method:'POST',url:base,headers:escritura,payload})
 assert.equal(r.statusCode,201,r.body);assert.deepEqual(r.json().destino,{tipo:'producto',id:'1'})
 env.tablas.producto[0].empresaId=2n
 r=await app.inject({method:'POST',url:base,headers:escritura,payload})
 assert.equal(r.statusCode,404,r.body)
})
test('footer: URL opcional no admite protocolos inseguros',async t=>{
 const {app}=await servidorCms('footerElemento');t.after(()=>app.close())
 const r=await app.inject({method:'POST',url:base,headers:escritura,payload:{empresaId:'1',tipo:'red_social',mostrar:true,enlace:'javascript:alert(1)'}})
 assert.equal(r.statusCode,400,r.body)
})
