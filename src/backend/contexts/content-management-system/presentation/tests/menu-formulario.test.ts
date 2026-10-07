import assert from 'node:assert/strict'
import {test} from 'node:test'
import {servidorCms,escritura,lectura} from './soporte-http-cms.js'
const base='/api/portal/cms/menus'
const datos=(grupo='Producto',tipo='producto',id='1')=>({empresaId:'1',grupo,destino:{tipo,id},ruta:'/products/correas/',icono:'Package',mostrar:true,cargarSubmenu:null})
test('HTTP menú: registro real obligatorio, orden automático e industria para Aplicacion',async()=>{
  const {app,env}=await servidorCms('menu');env.tablas.menu=[];env.tablas.producto[0].id=77n
  try {
    const a=await app.inject({method:'POST',url:base,headers:escritura,payload:datos('Producto','producto','77')})
    assert.equal(a.statusCode,201,a.body);assert.equal(a.json().registroId,'77');assert.equal(a.json().orden,1)
    const b=await app.inject({method:'POST',url:base,headers:escritura,payload:datos('Aplicacion','industria')})
    assert.equal(b.statusCode,201,b.body);assert.equal(b.json().destino.tipo,'industria')
    const sinDestino={...datos(),destino:undefined}
    assert.equal((await app.inject({method:'POST',url:base,headers:escritura,payload:sinDestino})).statusCode,400)
  }finally{await app.close()}
})
test('HTTP menú: catálogo ajeno/inexistente y tipo/grupo incorrecto se rechazan',async()=>{
  const {app,env}=await servidorCms('menu')
  try {
    for(const d of [datos('Aplicacion','producto'),datos('Producto','aplicacion')])assert.equal((await app.inject({method:'POST',url:base,headers:escritura,payload:d})).statusCode,400)
    assert.equal((await app.inject({method:'POST',url:base,headers:escritura,payload:datos('Producto','producto','999')})).statusCode,404)
    env.tablas.producto[0].empresaId=9n
    assert.equal((await app.inject({method:'POST',url:base,headers:escritura,payload:datos()})).statusCode,404)
    assert.equal(env.consultas.filter(c=>c.metodo==='create').length,0)
  }finally{await app.close()}
})
test('HTTP menú: puede corregir registro real durante edición; Lucide obligatorio en nuevas escrituras',async()=>{
  const {app,env}=await servidorCms('menu');env.tablas.producto.push({...env.tablas.producto[0],id:88n})
  try {
    const previo=(await app.inject({method:'GET',url:base+'/2',headers:lectura})).json()
    const {empresaId,...editar}=datos('Producto','producto','88')
    const a=await app.inject({method:'PATCH',url:base+'/2',headers:escritura,payload:{...editar,version:previo.actualizadoEn}})
    assert.equal(a.statusCode,200,a.body);assert.equal(a.json().registroId,'88');assert.equal(a.json().orden,previo.orden)
    assert.equal((await app.inject({method:'POST',url:base,headers:escritura,payload:{...datos(),icono:'fas fa-box'}})).statusCode,400)
  }finally{await app.close()}
})
