import assert from 'node:assert/strict'
import { test } from 'node:test'
import { registerHooks } from 'node:module'
import React,{act} from 'react'
import { createRoot } from 'react-dom/client'
import { renderToStaticMarkup } from 'react-dom/server'
import { JSDOM } from 'jsdom'
import { MemoryRouter,useLocation } from 'react-router-dom'
import { invalidarCachePublica } from '../src/frontend/features/publico/api/cache-publica'
import { rutaCategoria } from '../src/frontend/features/publico/presentation/datos-catalogo-publico'
import { mensajeCategoria } from '../src/frontend/features/publico/presentation/consulta-categoria'
Object.assign(globalThis,{React})
registerHooks({load(url,c,next){return url.endsWith('.css')?{format:'module',source:'',shortCircuit:true}:next(url,c)}})
const {TablaGamaPublica,GamaCategoriaPublica}=await import('../src/frontend/features/publico/presentation/gama-categoria-publica')
const {ProductoCatalogo}=await import('../src/frontend/features/publico/presentation/detalle-catalogo-publico')
const {CatalogoPublico}=await import('../src/frontend/features/publico/presentation/catalogo-publico')
const {Navigation}=await import('../src/frontend/features/publico/presentation/navigation')
const {MarcasPresentacion,posicionCarrusel}=await import('../src/frontend/features/publico/presentation/marcas-presentacion')
const {WhatsAppPublico,margenWhatsapp}=await import('../src/frontend/features/publico/presentation/whatsapp-publico')
const {columnasMarcas,MarcasProducto}=await import('../src/frontend/features/publico/presentation/componentes-catalogo')
const producto={id:'1',nombre:'Correas',slug:'correas',imagen:null,orden:1,marcas:[],categorias:[{id:'1',nombre:'Trapezoidales',slug:'correas/trapezoidales',imagen:null,descripcion:'<p>Descripción completa</p>',descripcionCorta:'Resumen',uso:'Transmisión',orden:1}]}
const datos={empresa:{id:'1',nombre:'Empresa',logo:null},menus:[],footer:[],secciones:[],configuracion:{whatsapp:{numero:'59177306576',mensaje:'Hola',activo:true},analytics:{id:'',activo:false},chat:{propertyId:'',widgetId:'',activo:false}}}
const gama={id:'1',categoriaId:'1',productoId:'1',titulo:'Gama Trapezoidales',descripcion:null,imagen:null,gruposColumnas:[{id:'2',codigo:'medidas',nombre:'Medidas',orden:1}],gruposFilas:[{id:'3',codigo:'clasicas',nombre:'Clásicas',orden:1}],columnas:[{id:'10',grupoId:'2',nombre:'Ancho',unidadMedida:'mm',tipoDato:'numero' as const,orden:1},{id:'11',grupoId:'2',nombre:'Compatible',unidadMedida:null,tipoDato:'booleano' as const,orden:2}],filas:[{id:'20',grupoId:'3',codigo:'a',nombre:'Sección A',descripcion:null,enlaceDetalle:null,orden:1},{id:'21',grupoId:null,codigo:'b',nombre:'Sección B',descripcion:null,enlaceDetalle:null,orden:2}],valores:[{filaId:'20',columnaId:'10',valor:'0'},{filaId:'20',columnaId:'11',valor:false}]}
const json=(v:unknown,status=200)=>new Response(JSON.stringify(v),{status,headers:{'content-type':'application/json'}})
async function montar(el:React.ReactNode,leer:typeof fetch=async()=>json({}),preparar?:(dom:JSDOM)=>void){
 invalidarCachePublica();const dom=new JSDOM('<div id="root"></div>',{url:'https://correas.test/'})
 Object.assign(globalThis,{window:dom.window,document:dom.window.document,HTMLElement:dom.window.HTMLElement,IS_REACT_ACT_ENVIRONMENT:true});dom.window.scrollTo=()=>{};preparar?.(dom)
 const antes=globalThis.fetch;globalThis.fetch=leer;const root=createRoot(document.getElementById('root')!);await act(async()=>root.render(<MemoryRouter future={{v7_startTransition:true,v7_relativeSplatPath:true}}>{el}</MemoryRouter>))
 return {cerrar:async()=>{await act(async()=>root.unmount());globalThis.fetch=antes;invalidarCachePublica();dom.window.close()}}
}
async function click(el:Element){await act(async()=>el.dispatchEvent(new window.MouseEvent('click',{bubbles:true,cancelable:true,button:0})))}
async function cambiar(el:HTMLSelectElement,valor:string){await act(async()=>{el.value=valor;el.dispatchEvent(new window.Event('change',{bubbles:true}))})}
test('submenú inactivo conserva categorías sin enlaces de detalle y ofrece consulta contextual',async()=>{
 const m=await montar(<ProductoCatalogo producto={{...producto,detalleCategoriasDisponible:false}} datos={datos}/>)
 try{assert.ok(document.body.textContent?.includes('Trapezoidales'));assert.equal(document.querySelector('a[href="/products/correas/trapezoidales"]'),null);assert.ok(document.querySelector('details summary'));const enlace=document.querySelector<HTMLAnchorElement>('.catalogo-consultar-categoria')!;assert.equal(new URL(enlace.href).searchParams.get('text'),'Buenas, me interesa conocer más información sobre las Correas Trapezoidales');assert.ok(enlace.querySelector('[data-icon="whatsapp"]'))}finally{await m.cerrar()}
})
test('submenú activo permite detalle canónico y no muestra descripción expandible en las tarjetas',async()=>{
 const m=await montar(<ProductoCatalogo producto={{...producto,detalleCategoriasDisponible:true}} datos={datos}/>)
 try{assert.ok(document.querySelector('a[href="/products/correas/trapezoidales"]'));assert.equal(document.querySelector('details'),null);assert.equal(document.querySelector('.catalogo-consultar-categoria'),null)}finally{await m.cerrar()}
})
test('URL directa de categoría apagada no solicita el detalle ni la gama',async()=>{
 const urls:string[]=[];const m=await montar(<CatalogoPublico ruta="/products/correas/trapezoidales" datos={datos}/>,async u=>{urls.push(String(u));return json({...producto,detalleCategoriasDisponible:false})})
 try{assert.ok(document.body.textContent?.includes('Recurso no disponible'));assert.deepEqual(urls,['/api/publico/catalogo/productos/correas'])}finally{await m.cerrar()}
})
test('padre con enlaces de submenú apagados que apuntan a sí mismo sigue abriendo el producto',async()=>{
 const menu={id:'1',grupo:'Producto',tipoRegistro:'producto',registroId:'1',ruta:'/products/correas/',icono:null,nombre:'Correas',orden:1,cargarSubmenu:false,items:[{id:'2',nombre:'Trapezoidales',categoriaId:'1',ruta:'/products/correas/',orden:1}]}
 const urls:string[]=[];const m=await montar(<CatalogoPublico ruta="/products/correas" datos={{...datos,menus:[menu]}}/>,async u=>{const url=String(u);urls.push(url);return json(url.includes('/productos?')?{items:[producto],limite:100,desplazamiento:0,hayMas:false}:{...producto,detalleCategoriasDisponible:false})})
 try{assert.equal(document.querySelector('h1')?.textContent,'Correas');assert.ok(!urls.some(u=>u.includes('/categorias')))}finally{await m.cerrar()}
})
test('nombre de producto navega y su botón separado expande sin navegar',async()=>{
 function Ubicacion(){return <output id="ubicacion">{useLocation().pathname}</output>}
 const menu={id:'1',grupo:'Producto' as const,nombre:'Correas',ruta:'/products/correas',icono:null,orden:1,cargarSubmenu:true,items:[{id:'2',nombre:'Trapezoidales',ruta:'/products/correas/trapezoidales',orden:1}]}
 const m=await montar(<><Navigation vista={{empresa:datos.empresa,menus:{Producto:[menu],Aplicacion:[],Servicio:[]},secciones:[]}}/><Ubicacion/></>)
 try{await click(document.querySelector('[aria-controls="grupo-Producto"]')!);await click(document.querySelector('[aria-controls="categorias-1"]')!);assert.equal(document.getElementById('ubicacion')?.textContent,'/');assert.equal(document.getElementById('categorias-1')?.hidden,false);await click(document.querySelector('.publico-producto-cabecera a')!);assert.equal(document.getElementById('ubicacion')?.textContent,'/products/correas')}finally{await m.cerrar()}
})
test('tabla de gama muestra agrupaciones, unidades, cero, false y ausencia sin inventar celdas',async()=>{
 const m=await montar(<TablaGamaPublica gama={gama}/>)
 try{assert.equal(document.querySelector('th[scope="colgroup"]')?.textContent,'Medidas');assert.equal(document.querySelector('th[scope="rowgroup"]')?.textContent,'Clásicas');assert.ok(document.querySelector('.gama-unidad')?.textContent?.includes('mm'));assert.deepEqual([...document.querySelectorAll('td')].map(c=>c.textContent),['0','No','—','—']);assert.ok(document.querySelector('[role="region"][tabindex="0"]'))}finally{await m.cerrar()}
})
test('gama ausente presenta estado vacío y error temporal permite reintentar',async()=>{
 const m=await montar(<GamaCategoriaPublica categoriaId="1"/>,async()=>json({error:'Sin gama'},404))
 try{assert.ok(document.body.textContent?.includes('No hay una gama técnica publicada'));assert.equal(document.querySelector('[role="alert"]'),null)}finally{await m.cerrar()}
 let intentos=0;const n=await montar(<GamaCategoriaPublica categoriaId="1"/>,async()=>++intentos===1?json({error:'Temporal'},500):json(gama))
 try{assert.ok(document.querySelector('[role="alert"]'));await click([...document.querySelectorAll('button')].find(b=>b.textContent==='Reintentar')!);assert.ok(document.querySelector('table'));assert.equal(intentos,2)}finally{await n.cerrar()}
})
test('consulta comercial adapta plurales y evita repetir el nombre del producto',()=>{
 assert.equal(mensajeCategoria('Rodamientos','Rígidos de Bolas'),'Buenas, me interesa conocer más información sobre los Rodamientos Rígidos de Bolas');assert.equal(mensajeCategoria('Correas','Correas en V'),'Buenas, me interesa conocer más información sobre las Correas en V');assert.equal(mensajeCategoria('Correa','Sincrónica'),'Buenas, me interesa conocer más información sobre la Correa Sincrónica')
 assert.equal(rutaCategoria({id:'1',slug:'correas'},{id:'1',slug:'correas/trapezoidales',detalleDisponible:false},[]),'/products/correas')
})
test('logos usan tres o cuatro columnas según cantidad',()=>{
 assert.deepEqual([3,4,5,6,7,8].map(columnasMarcas),[3,4,3,3,4,4]);const marcas=Array.from({length:6},(_,i)=>({id:String(i),nombre:'Marca '+i,slug:String(i),logo:null,orden:i}));const html=renderToStaticMarkup(<MarcasProducto marcas={marcas}/>);assert.match(html,/marcas-3/)
})
test('carrusel repite el ciclo sin cambiar el contenido visible y duplica solo decoraciones',async()=>{
 assert.equal(posicionCarrusel(2401,1200),1201);assert.equal(posicionCarrusel(1199,1200),2399)
 const marcas=[1,2].map(id=>({id:String(id),nombre:'Marca '+id,slug:'marca-'+id,logo:null,orden:id}));const m=await montar(<MarcasPresentacion marcas={marcas} modo="carrusel"/>)
 try{assert.equal(document.querySelectorAll('.marcas-grupo').length,3);assert.equal(document.querySelectorAll('.marcas-grupo[aria-hidden="true"]').length,2);assert.ok(document.querySelector('select option[value="70"]'))}finally{await m.cerrar()}
})
test('velocidad elegida por el visitante cambia el avance sin reconstruir los logos',async()=>{
 let siguiente!:FrameRequestCallback;const marcas=[1,2].map(id=>({id:String(id),nombre:'Marca '+id,slug:'marca-'+id,logo:null,orden:id}))
 const m=await montar(<MarcasPresentacion marcas={marcas} modo="carrusel"/>,async()=>json({}),dom=>{dom.window.requestAnimationFrame=cb=>{siguiente=cb;return 1};dom.window.cancelAnimationFrame=()=>{}})
 try{const pista=document.querySelector<HTMLDivElement>('.marcas-pista')!;Object.defineProperty(document.querySelector('.marcas-grupo')!,'scrollWidth',{value:1200});pista.scrollLeft=1200;await act(async()=>{siguiente(10);siguiente(90)});const lento=pista.scrollLeft-1200;await cambiar(document.querySelector('select')!,'70');const antes=pista.scrollLeft;await act(async()=>{siguiente(10);siguiente(90)});assert.ok(Math.abs((pista.scrollLeft-antes)-lento*2)<.001)}finally{await m.cerrar()}
})
test('WhatsApp eleva su margen al entrar el footer y no lo cubre',async()=>{
 assert.equal(margenWhatsapp(800,1200),24);assert.equal(margenWhatsapp(800,650),174)
 const m=await montar(<><footer className="publico-footer">Footer</footer><WhatsAppPublico configuracion={datos.configuracion.whatsapp}/></>)
 try{Object.defineProperty(window,'innerHeight',{value:800,configurable:true});document.querySelector('footer')!.getBoundingClientRect=()=>({top:650} as DOMRect);await act(async()=>window.dispatchEvent(new window.Event('scroll')));assert.equal(document.querySelector<HTMLAnchorElement>('.publico-whatsapp')?.style.bottom,'174px')}finally{await m.cerrar()}
})
