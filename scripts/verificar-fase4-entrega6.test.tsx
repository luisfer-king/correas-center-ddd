import assert from 'node:assert/strict'
import {test} from 'node:test'
import {registerHooks} from 'node:module'
import React,{act} from 'react'
import {createRoot} from 'react-dom/client'
import {MemoryRouter} from 'react-router-dom'
import {JSDOM} from 'jsdom'
Object.assign(globalThis,{React})
registerHooks({load(url,c,next){return url.endsWith('.css')?{format:'module',source:'',shortCircuit:true}:next(url,c)}})
const {SolucionesPublicas}=await import('../src/frontend/features/publico/presentation/soluciones-publicas')
const {esRutaSoluciones}=await import('../src/frontend/features/publico/presentation/soluciones-rutas')
const {invalidarCachePublica}=await import('../src/frontend/features/publico/api/cache-publica')
const servicio={id:'1',nombre:'Reparación',slug:'reparacion',imagen:null,descripcion:'<p>Servicio <strong>técnico</strong></p><script>window.pwned=true</script>',orden:1,industrias:[]}
const industria={id:'2',nombre:'Minería',slug:'mineria',imagen:null,orden:1,categorias:[{id:'3',nombre:'Trapezoidales',slug:'trapezoidales',descripcionCorta:'Correas industriales',producto:{id:'4',nombre:'Correas',slug:'correas'}}],servicios:[servicio]}
const datos:any={empresa:{nombre:'Empresa'},menus:[],configuracion:{whatsapp:{activo:true,numero:'59170000000',mensaje:''}}}
async function montar(ruta:string,responder:(url:string)=>Response|Promise<Response>,marco=datos){
 invalidarCachePublica();const dom=new JSDOM('<div id="root"></div>',{url:'https://correas.test/'})
 Object.assign(globalThis,{window:dom.window,document:dom.window.document,HTMLElement:dom.window.HTMLElement,IS_REACT_ACT_ENVIRONMENT:true})
 const anterior=globalThis.fetch;globalThis.fetch=async url=>responder(String(url));const root=createRoot(document.getElementById('root')!)
 await act(async()=>{root.render(<MemoryRouter future={{v7_startTransition:true,v7_relativeSplatPath:true}}><SolucionesPublicas ruta={ruta} datos={marco}/></MemoryRouter>);await new Promise(r=>setTimeout(r,25))})
 return {cerrar:async()=>{await act(async()=>root.unmount());globalThis.fetch=anterior;invalidarCachePublica();dom.window.close()}}
}
const json=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json'}})
test('rutas canónicas y alias CMS de industrias y servicios',()=>{
 for(const ruta of ['/applications','/applications/mineria','/services','/services/reparacion'])assert.ok(esRutaSoluciones(ruta,[]))
 assert.equal(esRutaSoluciones('/services/reparacion/otra',[]),false)
 assert.ok(esRutaSoluciones('/aplicacion-minera',[{tipoRegistro:'industria',ruta:'/aplicacion-minera'} as any]))
})
test('listados enlazan al detalle canónico sin depender del CMS',async()=>{
 for(const [ruta,item] of [['/applications',industria],['/services',servicio]] as const){const m=await montar(ruta,()=>json({items:[item],hayMas:false}));try{assert.equal(document.querySelector('.catalogo-tarjeta')?.getAttribute('href'),ruta+'/'+item.slug)}finally{await m.cerrar()}}
})
test('industria enlaza categorías al producto padre y servicios a su detalle',async()=>{
 const m=await montar('/applications/mineria',()=>json(industria));try{assert.equal(document.querySelector('h1')?.textContent,'Minería');assert.ok(document.querySelector('a[href="/products/correas"]'));assert.ok(document.querySelector('a[href="/services/reparacion"]'));assert.equal(document.querySelector('a[href="/products/correas/trapezoidales"]'),null)}finally{await m.cerrar()}
})
test('servicio sanea contenido y consulta WhatsApp con nombre y número configurado',async()=>{
 const m=await montar('/services/reparacion',()=>json(servicio));try{assert.ok(document.querySelector('.publico-html strong'));assert.equal(document.querySelector('script'),null);const enlace=document.querySelector('a[href^="https://wa.me/"]')!;assert.ok(enlace.getAttribute('href')?.includes('59170000000'));assert.ok(decodeURIComponent(enlace.getAttribute('href')!).includes('Reparación'));assert.ok(enlace.querySelector('svg'))}finally{await m.cerrar()}
})
test('alias CMS resuelve por identidad y no por el texto de la URL',async()=>{
 const solicitudes:string[]=[];const m=await montar('/sector-minero',url=>{solicitudes.push(url);return json(url.includes('/industrias?')?{items:[industria],hayMas:false}:industria)},{...datos,menus:[{tipoRegistro:'industria',registroId:'2',ruta:'/sector-minero'}]});try{assert.equal(document.querySelector('h1')?.textContent,'Minería');assert.ok(solicitudes.some(u=>u.endsWith('/industrias/mineria')))}finally{await m.cerrar()}
})
test('recurso inexistente presenta estado vacío y el error permite reintentar',async()=>{
 const m=await montar('/services/no-existe',()=>json({error:'No disponible'},404));try{assert.match(document.body.textContent! ,/Recurso no disponible/)}finally{await m.cerrar()}
 let llamadas=0;const n=await montar('/services/reparacion',()=>++llamadas===1?json({error:'Fallo'},500):json(servicio));try{assert.ok(document.querySelector('[role="alert"]'));await act(async()=>{document.querySelector('button')!.dispatchEvent(new window.MouseEvent('click',{bubbles:true}));await new Promise(r=>setTimeout(r,25))});assert.equal(document.querySelector('h1')?.textContent,'Reparación')}finally{await n.cerrar()}
})
