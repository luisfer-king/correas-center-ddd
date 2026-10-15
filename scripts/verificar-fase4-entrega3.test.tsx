import assert from 'node:assert/strict'
import { test } from 'node:test'
import React, { act } from 'react'
import { createRoot } from 'react-dom/client'
import { renderToStaticMarkup } from 'react-dom/server'
import { JSDOM } from 'jsdom'
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom'
import { registerHooks } from 'node:module'
import { cargarPublico, invalidarCachePublica } from '../src/frontend/features/publico/api/cache-publica'
import { obtenerMarcoPublico } from '../src/frontend/features/publico/api/cliente-marco-publico'
import { sanearHtmlCms } from '../src/frontend/features/publico/presentation/html-cms'
import { IconoRedSocial, resolverIconoRedSocial } from '../src/frontend/features/publico/presentation/icono-red-social'
import { WhatsAppPublico } from '../src/frontend/features/publico/presentation/whatsapp-publico'
import { ContenidoInstitucional } from '../src/frontend/features/publico/presentation/contenido-institucional'
import { BloqueCatalogoInicio } from '../src/frontend/features/publico/presentation/bloque-catalogo-inicio'
import { HeroPublico } from '../src/frontend/features/publico/presentation/hero-publico'
Object.assign(globalThis,{React})
registerHooks({load(url,c,next){return url.endsWith('.css')?{format:'module',source:'',shortCircuit:true}:next(url,c)}})

test('deduplica lectores simultáneos; cancelar uno no cancela al otro',async()=>{
 invalidarCachePublica();let llamadas=0,resolver!:(v:number)=>void
 const leer=()=>{llamadas++;return new Promise<number>(r=>{resolver=r})}
 const c=new AbortController(),a=cargarPublico('prueba',leer,c.signal),b=cargarPublico('prueba',leer)
 const rechazo=assert.rejects(a);await Promise.resolve();c.abort();resolver(7);await rechazo;assert.equal(await b,7);assert.equal(llamadas,1)
})
test('invalidación manual y expiración solicitan datos nuevos; los errores no se cachean',async()=>{
 invalidarCachePublica();const reloj=Date.now;let tiempo=0,llamadas=0;Date.now=()=>tiempo
 try{const leer=async()=>++llamadas;assert.equal(await cargarPublico('numero',leer),1);assert.equal(await cargarPublico('numero',leer),1);tiempo=16000;assert.equal(await cargarPublico('numero',leer),2);invalidarCachePublica();assert.equal(await cargarPublico('numero',leer),3)}finally{Date.now=reloj;invalidarCachePublica()}
 let intento=0;const fallo=async()=>{if(++intento===1)throw Error('Temporal');return 9};await assert.rejects(cargarPublico('fallo',fallo));assert.equal(await cargarPublico('fallo',fallo),9)
})
test('marco en ruta institucional no pide Inicio ni sucursales; reutiliza peticiones',async()=>{
 invalidarCachePublica();const anterior=globalThis.fetch,pedidos:string[]=[]
 globalThis.fetch=async entrada=>{const ruta=String(entrada);pedidos.push(ruta);return new Response(JSON.stringify(ruta.includes('/empresa')?{id:'1',nombre:'Empresa',logo:null}:ruta.includes('/configuracion')?{whatsapp:{numero:'',mensaje:'',activo:false},analytics:{id:'',activo:false},chat:{propertyId:'',widgetId:'',activo:false}}:{items:[],limite:100,desplazamiento:0,hayMas:false}),{headers:{'content-type':'application/json'}})}
 try{await Promise.all([obtenerMarcoPublico(undefined,'/about'),obtenerMarcoPublico(undefined,'/terms')]);assert.equal(pedidos.length,4);assert.ok(pedidos.every(p=>!p.includes('secciones')&&!p.includes('sucursales')))}finally{globalThis.fetch=anterior;invalidarCachePublica()}
})
test('identificadores Font Awesome de BD y logo de WhatsApp usan el paquete real',()=>{
 for(const nombre of ['faInstagram','fab fa-instagram','fa-brands fa-instagram','Instagram'])assert.equal(resolverIconoRedSocial(nombre)?.iconName,'instagram')
 assert.equal(resolverIconoRedSocial('Facebook')?.prefix,'fab');assert.equal(resolverIconoRedSocial('icono-no-existente'),null)
 const html=renderToStaticMarkup(<WhatsAppPublico configuracion={{numero:'59177306576',mensaje:'Consulta',activo:true}} />);assert.ok(html.includes('data-icon="whatsapp"'));assert.ok(!html.includes('lucide-message'))
})
async function montar(contenido:React.ReactNode,fetchPrueba?:typeof fetch,ruta='/'){
 invalidarCachePublica();const dom=new JSDOM('<div id="root"></div>',{url:'http://localhost:3000/'})
 Object.assign(globalThis,{window:dom.window,document:dom.window.document,HTMLElement:dom.window.HTMLElement,IS_REACT_ACT_ENVIRONMENT:true})
 const anterior=globalThis.fetch;if(fetchPrueba)globalThis.fetch=fetchPrueba
 const raiz=createRoot(document.getElementById('root')!)
 await act(async()=>raiz.render(<MemoryRouter initialEntries={[ruta]} future={{v7_startTransition:true,v7_relativeSplatPath:true}}>{contenido}</MemoryRouter>))
 return {cerrar:async()=>{await act(async()=>raiz.unmount());globalThis.fetch=anterior;invalidarCachePublica();dom.window.close()}}
}
async function click(e:Element){await act(async()=>e.dispatchEvent(new window.MouseEvent('click',{bubbles:true,cancelable:true,button:0})))}
test('HTML de CMS conserva formato y elimina scripts, eventos, SVG y URLs ejecutables',()=>{
 const dom=new JSDOM('');Object.assign(globalThis,{window:dom.window})
 try{const html=sanearHtmlCms('<p><strong>Correcto</strong><img src=x onerror=alert(1)><script>malicioso()</script><svg onload=alert(2)></svg><span onclick=alert(3)>Texto</span><a href="javascript:alert(4)">Enlace</a></p>');assert.ok(html.includes('<strong>Correcto</strong>'));assert.ok(!/script|onerror|onclick|onload|javascript|<svg|<img/.test(html))}finally{dom.window.close()}
})
const registros=[{id:'1',identificador:'introduccion',nombre:'Nuestra empresa',descripcion:'<p>Texto administrado</p>',orden:1,contenidos:[]},{id:'2',identificador:'estadisticas',nombre:'Estadísticas',descripcion:null,orden:2,contenidos:[{id:'20',titulo:'Experiencia',subtitulo:'25',descripcion:null,icono:null,orden:1}]},{id:'3',identificador:'filosofia',nombre:'Filosofía',descripcion:null,orden:3,contenidos:[{id:'30',titulo:'Misión publicada',subtitulo:null,descripcion:'<p>Contenido real</p>',icono:null,orden:1}]}]
const response=(items:unknown[])=>new Response(JSON.stringify({items,limite:100,desplazamiento:0,hayMas:false}),{headers:{'content-type':'application/json'}})
test('Nosotros consulta registros publicados y cambia de pestaña con teclado',async()=>{
 const m=await montar(<ContenidoInstitucional ruta="/about" empresa="Empresa" />,async()=>response(registros))
 try{assert.ok(document.body.textContent?.includes('Texto administrado'));const tabs=[...document.querySelectorAll('[role="tab"]')];assert.equal(tabs.length,2);await act(async()=>tabs[0].dispatchEvent(new window.KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true})));assert.equal(tabs[1].getAttribute('aria-selected'),'true');assert.ok(document.querySelector('[role="tabpanel"]')?.textContent?.includes('Misión publicada'))}finally{await m.cerrar()}
})
test('registro legal publicado tiene prioridad sobre contenido inicial',async()=>{
 const r=[{id:'9',identificador:'privacidad',nombre:'Política de nuestra empresa',descripcion:null,orden:1,contenidos:[{id:'90',titulo:'Contenido publicado',subtitulo:null,descripcion:'<p>Texto vigente</p>',icono:null,orden:1}]}]
 const m=await montar(<ContenidoInstitucional ruta="/privacy" empresa="Empresa" />,async()=>response(r))
 try{assert.equal(document.querySelector('h1')?.textContent,'Política de nuestra empresa');assert.ok(document.body.textContent?.includes('Texto vigente'));assert.ok(!document.body.textContent?.includes('Información que Recopilamos'))}finally{await m.cerrar()}
})
test('hero conserva metadata de CTA, controles y prioridad de la primera imagen',async()=>{
 const slides=[{id:'1',tipo:'hero',titulo:'Banner inicial',subtitulo:null,descripcion:null,icono:null,imagen:'/hero.png',metadata:{cta_primary_text:'Ver productos',cta_primary_href:'/products'},orden:1},{id:'2',tipo:'hero',titulo:'Segundo banner',subtitulo:null,descripcion:null,icono:null,imagen:null,metadata:{},orden:2}]
 const m=await montar(<HeroPublico slides={slides} empresa="Empresa" />)
 try{assert.equal(document.querySelector('img')?.getAttribute('fetchpriority'),'high');assert.ok(document.querySelector('a[href="/products"]'));await click(document.querySelector('[aria-label="Siguiente"]')!);assert.equal(document.querySelector('h1')?.textContent,'Segundo banner')}finally{await m.cerrar()}
})
test('portal diferido sigue presentando acceso y protegiendo rutas privadas',async()=>{
 const {RutasPortal}=await import('../src/frontend/app/rutas-portal')
 function Ubicacion(){const p=useLocation();return <output id="url-prueba">{p.pathname}</output>}
 const m=await montar(<><Routes><Route path="/portal/*" element={<RutasPortal />} /></Routes><Ubicacion /></>,async()=>new Response(JSON.stringify({error:'Sin sesión'}),{status:401,headers:{'content-type':'application/json'}}),'/portal/roles')
 try{assert.equal(document.getElementById('url-prueba')?.textContent,'/portal/acceso');assert.ok(document.querySelector('input[type="password"]'))}finally{await m.cerrar()}
})

test('bloque fuera de la zona visible no solicita datos hasta aproximarse al viewport',async()=>{
 const anterior=Object.getOwnPropertyDescriptor(globalThis,'IntersectionObserver');let callback!:IntersectionObserverCallback,llamadas=0
 class Observer { constructor(c:IntersectionObserverCallback){callback=c} observe(){} disconnect(){} }
 Object.defineProperty(globalThis,'IntersectionObserver',{configurable:true,writable:true,value:Observer})
 const datos={empresa:{id:'1',nombre:'Empresa',logo:null},configuracion:{whatsapp:{numero:'',mensaje:'',activo:false},analytics:{id:'',activo:false},chat:{propertyId:'',widgetId:'',activo:false}},menus:[],footer:[],secciones:[]}
 const leer=async()=>{llamadas++;return [{id:'1',nombre:'Producto publicado',imagen:null}]}
 const m=await montar(<BloqueCatalogoInicio titulo="Productos" subtitulo="Catálogo" tipo="producto" lista="/products" leer={leer} datos={datos} />)
 try{assert.equal(llamadas,0);await act(async()=>callback([{isIntersecting:true}] as IntersectionObserverEntry[],{} as IntersectionObserver));assert.equal(llamadas,1);assert.ok(document.body.textContent?.includes('Producto publicado'))}finally{await m.cerrar();if(anterior)Object.defineProperty(globalThis,'IntersectionObserver',anterior);else Reflect.deleteProperty(globalThis,'IntersectionObserver')}
})
