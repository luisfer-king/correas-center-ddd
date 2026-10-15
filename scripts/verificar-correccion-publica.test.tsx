import assert from 'node:assert/strict'
import { test } from 'node:test'
import React, { act } from 'react'
import { JSDOM } from 'jsdom'
import { createRoot } from 'react-dom/client'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { Navigation } from '../src/frontend/features/publico/presentation/navigation'
import { IconoPublico } from '../src/frontend/features/publico/presentation/icono-publico'
import { CategoriasDestinoProducto } from '../src/frontend/features/publico/presentation/categorias-destino-producto'
import { FooterPublico } from '../src/frontend/features/publico/presentation/footer-publico'
import type { VistaPublica } from '../src/shared/vista-publica'
import type { DatosMarcoPublico } from '../src/frontend/features/publico/api/cliente-marco-publico'
Object.assign(globalThis,{React})
const menu={id:'1',nombre:'Correas',grupo:'Producto' as const,ruta:'/products/correas',icono:'Package',orden:1,items:Array.from({length:5},(_,i)=>({id:String(i+2),nombre:'Categoría '+(i+1),ruta:'/products/correas/categoria-'+i,orden:i}))}
const vista:VistaPublica={empresa:{id:'42',nombre:'Correas Center',logo:null},menus:{Producto:[menu],Aplicacion:[],Servicio:[]},secciones:[]}
function Destino(){const l=useLocation();return <output id="destino">{l.pathname}</output>}
async function montar(contenido:React.ReactNode=<><Navigation vista={vista} institucional /><Destino /></>){
 const dom=new JSDOM('<div id="raiz"></div>',{url:'http://localhost:3000/'})
 Object.assign(globalThis,{React,window:dom.window,document:dom.window.document,HTMLElement:dom.window.HTMLElement,IS_REACT_ACT_ENVIRONMENT:true})
 const root=createRoot(document.getElementById('raiz')!);await act(async()=>root.render(<MemoryRouter future={{v7_startTransition:true,v7_relativeSplatPath:true}}>{contenido}</MemoryRouter>))
 return { cerrar:async()=>{await act(async()=>root.unmount());dom.window.close()} }
}
async function click(e:Element){await act(async()=>{e.dispatchEvent(new window.MouseEvent('click',{bubbles:true,cancelable:true,button:0}))})}
async function hover(e:Element,desde:Element){await act(async()=>{desde.dispatchEvent(new window.MouseEvent('mouseout',{bubbles:true,relatedTarget:e}));e.dispatchEvent(new window.MouseEvent('mouseover',{bubbles:true,relatedTarget:desde}))})}
test('los iconos son síncronos y el encabezado muestra el eslogan aprobado',async()=>{
 const html=renderToStaticMarkup(<IconoPublico nombre="Package" />);assert.ok(html.includes('<svg'));assert.ok(!html.includes('Suspense'))
 const m=await montar();try{assert.ok(document.querySelector('header')!.textContent!.includes('Solución Confiable'));assert.ok(document.querySelector('header .lucide-chevron-down'))}finally{await m.cerrar()}
})
test('hover seguido de clic mantiene abierto el grupo; segundo clic lo cierra',async()=>{
 const m=await montar();try{const grupo=document.querySelector('.publico-grupo')!,boton=document.querySelector('[aria-controls="grupo-Producto"]')!;await hover(grupo,document.body);await click(boton);assert.equal(boton.getAttribute('aria-expanded'),'true');await click(boton);assert.equal(boton.getAttribute('aria-expanded'),'false')}finally{await m.cerrar()}
})
test('producto se expande por clic, muestra tres categorías y Ver más conserva destino',async()=>{
 const m=await montar();try{
  await click(document.querySelector('[aria-controls="grupo-Producto"]')!);const b=document.querySelector('[aria-controls="categorias-1"]')!;assert.equal(b.getAttribute('aria-expanded'),'false');await click(b)
  const panel=document.getElementById('categorias-1')!;assert.equal(panel.hidden,false);assert.equal(panel.querySelectorAll('li').length,3);const mas=panel.querySelector<HTMLAnchorElement>('.publico-ver-mas')!;assert.equal(mas.getAttribute('href'),'/products/correas');await click(mas);assert.equal(document.getElementById('destino')!.textContent,'/products/correas')
 }finally{await m.cerrar()}
})
test('producto se expande también por hover',async()=>{
 const m=await montar();try{await click(document.querySelector('[aria-controls="grupo-Producto"]')!);await hover(document.querySelector('.publico-categoria')!,document.querySelector('.publico-grupo')!);assert.equal(document.getElementById('categorias-1')!.hidden,false)}finally{await m.cerrar()}
})
test('cruzar hacia el panel no cierra el grupo; salir de todo el encabezado sí lo cierra',async()=>{
 const m=await montar();try{
  const b=document.querySelector('[aria-controls="grupo-Producto"]')!;await click(b)
  const header=document.querySelector('header')!, panel=document.getElementById('grupo-Producto')!
  await act(async()=>{header.dispatchEvent(new window.MouseEvent('mouseout',{bubbles:true,relatedTarget:panel}));await new Promise(r=>setTimeout(r,260))});assert.equal(b.getAttribute('aria-expanded'),'true')
  await act(async()=>{header.dispatchEvent(new window.MouseEvent('mouseout',{bubbles:true,relatedTarget:document.body}));await new Promise(r=>setTimeout(r,260))});assert.equal(b.getAttribute('aria-expanded'),'false')
 }finally{await m.cerrar()}
})
test('regresar antes del margen de cierre cancela el cierre',async()=>{
 const m=await montar();try{
  const b=document.querySelector('[aria-controls="grupo-Producto"]')!,h=document.querySelector('header')!;await click(b)
  await act(async()=>h.dispatchEvent(new window.MouseEvent('mouseout',{bubbles:true,relatedTarget:document.body})))
  await hover(h,document.body);await act(async()=>{await new Promise(r=>setTimeout(r,260))});assert.equal(b.getAttribute('aria-expanded'),'true')
 }finally{await m.cerrar()}
})
test('vista del producto consulta por identidad y muestra todas las categorías, incluso fuera del menú',async()=>{
 const anterior=globalThis.fetch;const pedidos:string[]=[]
 globalThis.fetch=async(input)=>{const ruta=String(input);pedidos.push(ruta);const d=ruta.includes('/productos/')?{id:'80',nombre:'Correas',slug:'slug-real',imagen:null,orden:1,categorias:Array.from({length:7},(_,i)=>({id:String(i),nombre:'Catálogo '+i,slug:'c'+i,imagen:null,descripcionCorta:null,uso:null,orden:i})),marcas:[]}:{items:[{id:'80',nombre:'Correas',slug:'slug-real',imagen:null,orden:1}],limite:100,desplazamiento:0,hayMas:false};return new Response(JSON.stringify(d),{headers:{'content-type':'application/json'}})}
 const m=await montar(<CategoriasDestinoProducto menu={{...menu,grupo:'Producto',tipoRegistro:'producto',registroId:'80',cargarSubmenu:true,items:[]}} />)
 try{assert.equal(document.querySelectorAll('.publico-categorias-grid article').length,7);assert.ok(pedidos.some(p=>p.endsWith('/productos/slug-real')))}finally{await m.cerrar();globalThis.fetch=anterior}
})
test('footer recupera estructura original, redes junto a empresa y sucursales',()=>{
 Object.assign(globalThis,{React});const datos:DatosMarcoPublico={empresa:vista.empresa,configuracion:{whatsapp:{numero:'',mensaje:'',activo:false},analytics:{id:'',activo:false},chat:{propertyId:'',widgetId:'',activo:false}},menus:[],footer:[{id:'1',tipo:'red_social',tipoRegistro:null,registroId:null,titulo:'Instagram',url:'https://example.com',icono:'faInstagram',orden:1}],secciones:[],sucursales:[{id:'5',nombre:'Sucursal pública',direccion:'Dirección pública',telefono:'12345678',email:null,horarios:'Lunes a viernes',mapaIncrustado:null,latitud:null,longitud:null,esPrincipal:true,orden:1}]}
 const html=renderToStaticMarkup(<MemoryRouter><FooterPublico datos={datos} actualizar={()=>{}} cargando={false} /></MemoryRouter>);assert.ok(html.includes('Nuestras Sucursales'));assert.ok(html.includes('Sucursal pública'));assert.ok(html.includes('Fabricante Autorizado SKF Bolivia'));assert.ok(html.includes('publico-redes'));assert.ok(!html.includes('publico-footer-marca'));assert.ok(html.includes('Mantente Informado'))
})
