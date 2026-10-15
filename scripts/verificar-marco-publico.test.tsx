import assert from 'node:assert/strict'
import { test } from 'node:test'
import { registerHooks } from 'node:module'
import { JSDOM } from 'jsdom'
import React, { act } from 'react'
import { createRoot } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
registerHooks({ load(url, context, siguiente) { return url.endsWith('.css') ? { format:'module',source:'',shortCircuit:true } : siguiente(url,context) } })
const { VistaPublica } = await import('../src/frontend/features/publico/presentation/vista-publica')
async function montar(ruta = '/') {
 const dom = new JSDOM('<div id="raiz"></div>',{url:'http://localhost:3000/'})
 Object.assign(globalThis,{React,window:dom.window,document:dom.window.document,HTMLElement:dom.window.HTMLElement,IS_REACT_ACT_ENVIRONMENT:true})
 dom.window.scrollTo = ()=>{}
 const fetchAnterior = globalThis.fetch
 let whatsapp = true, falla = false
 const solicitudes: string[] = []
 globalThis.fetch = async entrada => {
  const url = String(entrada);solicitudes.push(url)
  if (falla) return new Response(JSON.stringify({error:'Empresa pública no disponible'}),{status:404,headers:{'content-type':'application/json'}})
  let resultado: unknown
  if (url.includes('/commercial/empresa')) resultado = {id:'42',nombre:'Correas Center',logo:null}
  else if (url.includes('/configuracion')) resultado = {whatsapp:{numero:'59177306576',mensaje:'Hola',activo:whatsapp},analytics:{id:'',activo:false},chat:{propertyId:'',widgetId:'',activo:false}}
  else if (url.includes('/catalogo/productos/correas')) resultado = {id:'80',nombre:'Correas',slug:'correas',imagen:null,orden:1,marcas:[],categorias:[{id:'9',nombre:'Correas en V',slug:'correas-v',imagen:null,descripcion:null,descripcionCorta:null,uso:null,orden:1}]}
  else if (url.includes('/catalogo/productos')) resultado = {items:[{id:'80',nombre:'Correas',slug:'correas',imagen:null,orden:1}],limite:100,desplazamiento:0,hayMas:false}
  else if (url.endsWith('/gama')) return new Response(JSON.stringify({error:'Sin gama'}),{status:404,headers:{'content-type':'application/json'}})
  else if (url.includes('/catalogo/categorias')) resultado = {items:[{id:'9',nombre:'Correas en V',slug:'correas-v',imagen:null,descripcion:null,descripcionCorta:null,uso:null,orden:1,atributos:[],producto:{id:'80',nombre:'Correas',slug:'correas',imagen:null,orden:1}}],limite:1,desplazamiento:0,hayMas:false}
  else resultado = {items:url.includes('/menus') ? [{id:'1',nombre:'Correas',tipoRegistro:'producto',registroId:'80',grupo:'Producto',ruta:'/products/correas',icono:null,orden:1,cargarSubmenu:true,items:[{id:'2',nombre:'Correas en V',categoriaId:'9',ruta:'/products/correas/correas-v',orden:1}]}] : url.includes('/secciones') ? [{id:'1',tipo:'hero',titulo:'Bienvenido',subtitulo:null,descripcion:null,imagen:null,icono:null,metadata:{},orden:1}] : [],limite:100,desplazamiento:0,hayMas:false}
  return new Response(JSON.stringify(resultado),{headers:{'content-type':'application/json'}})
 }
 const root = createRoot(document.getElementById('raiz')!)
 await act(async()=>{root.render(<MemoryRouter initialEntries={[ruta]}><VistaPublica /></MemoryRouter>)})
 return { dom, solicitudes, setWhatsapp:(v:boolean)=>{whatsapp=v}, setFalla:(v:boolean)=>{falla=v}, cerrar:async()=>{await act(async()=>root.unmount());globalThis.fetch=fetchAnterior;dom.window.close()} }
}
async function click(el: Element) {await act(async()=>{el.dispatchEvent(new window.MouseEvent('click',{bubbles:true,cancelable:true,button:0}))})}
test('marco carga API nueva y navegar cierra menú y enfoca contenido', async()=>{
 const m = await montar();try {
  assert.ok(document.querySelector('h1')?.textContent==='Bienvenido');assert.ok(m.solicitudes.every(s=>!s.includes('/api/publico/vista')))
  const menu = document.querySelector<HTMLButtonElement>('.publico-mobile')!;await click(menu)
  await click([...document.querySelectorAll('.publico-grupo>button')].find(b=>b.textContent?.includes('Productos'))!)
  await click([...document.querySelectorAll('header a')].find(a=>a.textContent==='Correas en V')!)
  for(let i=0;i<30&&!document.querySelector('.catalogo-cabecera');i++)await act(async()=>{await new Promise(r=>setTimeout(r,10))})
  assert.equal(document.querySelector('h1')?.textContent,'Correas en V');assert.equal(menu.getAttribute('aria-expanded'),'false')
  assert.equal(document.activeElement?.id,'contenido-publico');assert.equal(document.querySelector('[aria-current="page"]')?.textContent,'Correas en V')
 }finally{await m.cerrar()}
})
test('ruta desconocida conserva URL y muestra página no encontrada',async()=>{
 const m = await montar('/desconocida');try{assert.equal(document.querySelector('h1')?.textContent,'Página no encontrada');assert.match(document.title,/Página no encontrada/)}finally{await m.cerrar()}
})
test('actualización respeta WhatsApp desactivado y elimina datos si empresa deja de publicarse',async()=>{
 const m = await montar();try{
  assert.ok(document.querySelector('.publico-whatsapp'));m.setWhatsapp(false)
  await click([...document.querySelectorAll('button')].find(b=>b.textContent==='Actualizar contenido')!)
  assert.equal(document.querySelector('.publico-whatsapp'),null)
  m.setFalla(true);await click([...document.querySelectorAll('button')].find(b=>b.textContent==='Actualizar contenido')!)
  assert.equal(document.querySelector('header'),null);assert.ok(document.querySelector('[role="alert"]'));assert.ok([...document.querySelectorAll('button')].some(b=>b.textContent==='Reintentar'))
 }finally{await m.cerrar()}
})
test('Escape restaura foco y clic exterior cierra el menú',async()=>{
 const m = await montar();try{
  const mobile=document.querySelector<HTMLButtonElement>('.publico-mobile')!;await click(mobile)
  await act(async()=>{mobile.dispatchEvent(new window.KeyboardEvent('keydown',{key:'Escape',bubbles:true}))})
  assert.equal(mobile.getAttribute('aria-expanded'),'false');assert.equal(document.activeElement,mobile)
  await click(mobile);await act(async()=>{document.querySelector('main')!.dispatchEvent(new window.Event('pointerdown',{bubbles:true}))})
  assert.equal(mobile.getAttribute('aria-expanded'),'false')
 }finally{await m.cerrar()}
})
