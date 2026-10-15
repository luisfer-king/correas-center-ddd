import assert from 'node:assert/strict'
import {test} from 'node:test'
import {registerHooks} from 'node:module'
import React,{act} from 'react'
import {createRoot} from 'react-dom/client'
import {MemoryRouter,useLocation} from 'react-router-dom'
import {JSDOM} from 'jsdom'
Object.assign(globalThis,{React})
registerHooks({load(url,c,next){return url.endsWith('.css')?{format:'module',source:'',shortCircuit:true}:next(url,c)}})
const {Navigation}=await import('../src/frontend/features/publico/presentation/navigation')
const {CategoriaCatalogo}=await import('../src/frontend/features/publico/presentation/detalle-catalogo-publico')
async function montar(el:React.ReactNode){
 const dom=new JSDOM('<div id="root"></div>',{url:'https://correas.test/'})
 Object.assign(globalThis,{window:dom.window,document:dom.window.document,HTMLElement:dom.window.HTMLElement,IS_REACT_ACT_ENVIRONMENT:true})
 const antes=globalThis.fetch;globalThis.fetch=async()=>new Response(JSON.stringify({error:'Sin gama'}),{status:404,headers:{'content-type':'application/json'}})
 const root=createRoot(document.getElementById('root')!);await act(async()=>root.render(<MemoryRouter future={{v7_startTransition:true,v7_relativeSplatPath:true}}>{el}</MemoryRouter>))
 return {cerrar:async()=>{await act(async()=>root.unmount());globalThis.fetch=antes;dom.window.close()}}
}
async function click(el:Element){await act(async()=>el.dispatchEvent(new window.MouseEvent('click',{bubbles:true,cancelable:true,button:0})))}
function Ubicacion(){return <output id="url">{useLocation().pathname}</output>}
for(const habilitado of [false,true])test('navigation muestra tres categorías con submenú '+(habilitado?'activo':'inactivo')+' y respeta su destino',async()=>{
 const menu={id:'1',nombre:'Correas',grupo:'Producto' as const,ruta:'/products/correas',orden:1,icono:null,cargarSubmenu:habilitado,items:Array.from({length:4},(_,i)=>({id:String(i+1),nombre:'Categoría '+i,ruta:'/products/correas/categoria-'+i,orden:i+1}))}
 const m=await montar(<><Navigation vista={{empresa:{id:'1',nombre:'Empresa',logo:null},menus:{Producto:[menu],Aplicacion:[],Servicio:[]},secciones:[]}}/><Ubicacion/></>)
 try{await click(document.querySelector('[aria-controls="grupo-Producto"]')!);const boton=document.querySelector('[aria-controls="categorias-1"]')!;assert.ok(boton);await click(boton);const panel=document.getElementById('categorias-1')!;assert.equal(panel.hidden,false);assert.equal(panel.querySelectorAll('li').length,3);assert.equal(panel.querySelector('.publico-ver-mas')?.getAttribute('href'),'/products/correas');await click(panel.querySelector('li a')!);assert.equal(document.getElementById('url')?.textContent,habilitado?'/products/correas/categoria-0':'/products/correas')}finally{await m.cerrar()}
})
test('gama se renderiza en una sección independiente de la información y consulta lateral',async()=>{
 const producto={id:'1',nombre:'Correas',slug:'correas',imagen:null,orden:1},categoria={id:'1',nombre:'Trapezoidales',slug:'correas/trapezoidales',imagen:null,descripcion:null,descripcionCorta:null,uso:null,orden:1,producto,atributos:[],detalleDisponible:true}
 const datos={empresa:{id:'1',nombre:'Empresa',logo:null},menus:[],secciones:[],footer:[],configuracion:{whatsapp:{numero:'',mensaje:'',activo:false},analytics:{id:'',activo:false},chat:{propertyId:'',widgetId:'',activo:false}}}
 const m=await montar(<CategoriaCatalogo categoria={categoria} datos={datos}/>)
 try{const gamma=document.querySelector('.catalogo-gama-ancha')!;assert.ok(gamma);assert.equal(gamma.closest('.catalogo-detalle-grid'),null);assert.equal(gamma.closest('.publico-inicio-contenedor'),null);assert.ok(gamma.querySelector('.gama-publica'));assert.ok(document.querySelector('.catalogo-detalle-grid .catalogo-consulta'))}finally{await m.cerrar()}
})
