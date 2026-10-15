import assert from 'node:assert/strict'
import { test } from 'node:test'
import { registerHooks } from 'node:module'
import React, { act } from 'react'
import { createRoot } from 'react-dom/client'
import { JSDOM } from 'jsdom'
import { MemoryRouter, useSearchParams } from 'react-router-dom'
import { filtrarProductos, rutaProducto, rutaCategoria, esRutaCatalogo, valorAtributo } from '../src/frontend/features/publico/presentation/datos-catalogo-publico'
import { invalidarCachePublica } from '../src/frontend/features/publico/api/cache-publica'
import { marcasInicio } from '../src/frontend/features/publico/api/cliente-contenido-publico'
import { mapaSucursal } from '../src/frontend/features/publico/presentation/mapa-sucursal'
import { ConfiguracionSitio } from '../src/backend/contexts/content-management-system/domain/configuracion-sitio'
import { PrismaPublicoConfiguracion } from '../src/backend/contexts/content-management-system/infrastructure/prisma-publico-configuracion'
import { PrismaPublicoProductos } from '../src/backend/contexts/catalog-management/infrastructure/prisma-publico-productos'
Object.assign(globalThis,{React})
registerHooks({load(url,c,next){return url.endsWith('.css')?{format:'module',source:'',shortCircuit:true}:next(url,c)}})
const {CatalogoPublico}=await import('../src/frontend/features/publico/presentation/catalogo-publico')
const {AtributosCategoria}=await import('../src/frontend/features/publico/presentation/detalle-catalogo-publico')
const {FormularioConfiguracionSitio}=await import('../src/frontend/features/cms/presentation/formulario-configuracion-sitio')
const {MarcasInicio}=await import('../src/frontend/features/publico/presentation/marcas-inicio')
const {HeroPublico}=await import('../src/frontend/features/publico/presentation/hero-publico')
const {revisionPublicaClave}=await import('../src/frontend/features/publico/api/actualizacion-publica')
const marca={id:'5',nombre:'SKF',slug:'skf',logo:null,orden:1}
const p={id:'80',nombre:'Correas',slug:'correas',imagen:null,orden:1,categorias:[{id:'9',nombre:'Correas en V',slug:'correas-v',uso:'Transmisión'}],marcas:[marca]}
const menu={id:'1',nombre:'Nombre CMS',tipoRegistro:'producto',registroId:'80',grupo:'Producto',ruta:'/catalogo/alias',icono:null,orden:1,cargarSubmenu:true,items:[{id:'2',nombre:'Categoría CMS',categoriaId:'9',ruta:'/catalogo/alias/custom',orden:1}]}
const datos={empresa:{id:'42',nombre:'Correas Center',logo:null},menus:[menu],footer:[],secciones:[],configuracion:{whatsapp:{numero:'',mensaje:'',activo:false},analytics:{id:'',activo:false},chat:{propertyId:'',widgetId:'',activo:false}}}
const detalle={...p,detalleCategoriasDisponible:true,categorias:[{...p.categorias[0],imagen:null,descripcion:null,descripcionCorta:'Para uso industrial',orden:1}]}
const categoria={...detalle.categorias[0],producto:p,atributos:[]}
const json=(v:unknown,status=200)=>new Response(JSON.stringify(v),{status,headers:{'content-type':'application/json'}})
const pagina=(items:unknown[],hayMas=false)=>({items,limite:100,desplazamiento:0,hayMas})
async function montar(el:React.ReactNode,fetchPrueba:typeof fetch,ruta='/'){
 invalidarCachePublica();const dom=new JSDOM('<div id="root"></div>',{url:'https://correas.test/'})
 Object.assign(globalThis,{window:dom.window,document:dom.window.document,HTMLElement:dom.window.HTMLElement,IS_REACT_ACT_ENVIRONMENT:true});dom.window.scrollTo=()=>{}
 const antes=globalThis.fetch;globalThis.fetch=fetchPrueba;const root=createRoot(document.getElementById('root')!)
 await act(async()=>root.render(<MemoryRouter initialEntries={[ruta]} future={{v7_startTransition:true,v7_relativeSplatPath:true}}>{el}</MemoryRouter>))
 return {cerrar:async()=>{await act(async()=>root.unmount());globalThis.fetch=antes;invalidarCachePublica();dom.window.close()}}
}
async function click(el:Element){await act(async()=>el.dispatchEvent(new window.MouseEvent('click',{bubbles:true,cancelable:true,button:0})))}
async function cambiar(el:HTMLSelectElement,valor:string){await act(async()=>{el.value=valor;el.dispatchEvent(new window.Event('change',{bubbles:true}))})}
test('filtros combinan marca, uso y búsqueda sin acentos antes de paginar',()=>{
 const otro={...p,id:'81',nombre:'Mangueras',marcas:[],categorias:[],orden:2}
 assert.deepEqual(filtrarProductos([p,otro],'transmision','5','Transmisión','orden').map(p=>p.id),['80'])
 assert.equal(filtrarProductos([p,otro],'skf','','','orden').length,1)
 assert.equal(filtrarProductos([p,otro],'','5','Inexistente','orden').length,0)
 assert.equal(filtrarProductos([p,otro],'','','','nombre_desc')[0].nombre,'Mangueras')
})
test('enlaces CMS usan identidad y rechazan destinos inseguros',()=>{
 assert.equal(rutaProducto(p,[menu]),'/products/correas');assert.equal(rutaCategoria(p,categoria,[menu]),'/products/correas/correas-v')
 assert.equal(rutaProducto(p,[{...menu,ruta:'javascript:alert(1)'}]),'/products/correas')
 assert.equal(rutaCategoria(p,categoria,[]),'/products/correas/correas-v');assert.equal(esRutaCatalogo('/catalogo/alias/custom',[menu]),true);assert.equal(esRutaCatalogo('/products/a/b/c',[]),false)
})
test('atributos conservan cero, false, unidades y valores ausentes',()=>{
 const a={id:'1',nombre:'Medida',descripcion:null,tipoDato:'numero' as const,valor:'0',unidadMedida:'mm',orden:1,tipo:{nombre:'Medidas',slug:'medidas',icono:null}}
 assert.equal(valorAtributo(a),'0 mm');assert.equal(valorAtributo({...a,tipoDato:'booleano',valor:false}),'No');assert.equal(valorAtributo({...a,valor:null}),'Sin especificar')
})
test('producto canónico usa una petición de detalle y enlaza todas sus categorías',async()=>{
 const urls:string[]=[];const m=await montar(<CatalogoPublico ruta="/products/correas" datos={{...datos,menus:[]}}/>,async u=>{urls.push(String(u));return json(detalle)})
 try{assert.equal(document.querySelector('h1')?.textContent,'Correas');assert.ok(document.querySelector('a[href="/products/correas/correas-v"]'));assert.deepEqual(urls,['/api/publico/catalogo/productos/correas'])}finally{await m.cerrar()}
})
test('categoría personalizada usa IDs y consulta el producto correcto',async()=>{
 const urls:string[]=[];const m=await montar(<CatalogoPublico ruta="/catalogo/alias/custom" datos={datos}/>,async u=>{const url=String(u);urls.push(url);return url.endsWith('/gama')?json({error:'Sin gama'},404):json(url.includes('/categorias')?pagina([categoria]):url.includes('/productos/correas')?detalle:pagina([p]))})
 try{assert.equal(document.querySelector('h1')?.textContent,'Correas en V');assert.ok(urls.some(s=>s.includes('productoSlug=correas')&&s.includes('slug=correas-v')));assert.ok(document.querySelector('a[href="/products/correas"]'))}finally{await m.cerrar()}
})
test('ausencia de categoría y producto despublicado no redirigen a otro recurso',async()=>{
 for(const ruta of ['/products/correas/inexistente','/products/oculto']){const m=await montar(<CatalogoPublico ruta={ruta} datos={{...datos,menus:[]}}/>,async()=>ruta.includes('inexistente')?json(pagina([])):json({error:'No disponible'},404));try{assert.ok(document.body.textContent?.includes('Recurso no disponible'));assert.ok(!document.querySelector('.catalogo-detalle-grid'))}finally{await m.cerrar()}}
})
test('pestañas de atributos cambian por teclado y mantienen el foco',async()=>{
 const atributos=[{id:'1',nombre:'Cero',descripcion:null,tipoDato:'numero' as const,valor:'0',unidadMedida:'mm',orden:1,tipo:{nombre:'Medidas',slug:'medidas',icono:null}},{id:'2',nombre:'Compatible',descripcion:null,tipoDato:'booleano' as const,valor:false,unidadMedida:null,orden:2,tipo:{nombre:'Uso',slug:'uso',icono:null}}]
 const m=await montar(<AtributosCategoria atributos={atributos}/>,async()=>json({}))
 try{assert.ok(document.querySelector('[role="tabpanel"]')?.textContent?.includes('0 mm'));await act(async()=>document.querySelector('[role="tab"]')!.dispatchEvent(new window.KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true})));assert.ok(document.querySelector('[role="tabpanel"]')?.textContent?.includes('No'));assert.equal(document.activeElement?.getAttribute('aria-selected'),'true')}finally{await m.cerrar()}
})
test('búsqueda inválida no consulta; Ver más añade el siguiente lote',async()=>{
 let pedidos=0;const m=await montar(<CatalogoPublico ruta="/search" datos={datos}/>,async()=>{pedidos++;return json(pagina([]))},'/search?q=a')
 try{assert.equal(pedidos,0)}finally{await m.cerrar()}
 const urls:string[]=[];const n=await montar(<CatalogoPublico ruta="/search" datos={datos}/>,async u=>{const url=String(u);urls.push(url);return url.endsWith('/gama')?json({error:'Sin gama'},404):json(url.includes('/categorias')?pagina([]):url.includes('desplazamiento=12')?pagina([{...p,id:'81',nombre:'Segundo lote'}]):pagina([p],true))},'/search?q=correas')
 try{await click([...document.querySelectorAll('button')].find(b=>b.textContent==='Ver más productos')!);assert.ok(document.body.textContent?.includes('Segundo lote'));assert.ok(urls.some(s=>s.includes('desplazamiento=12')));assert.equal(document.querySelectorAll('.catalogo-resultados')[0].querySelectorAll('.catalogo-tarjeta').length,2)}finally{await n.cerrar()}
})
test('selector administrativo cambia la vista previa antes de guardar',async()=>{
 let guardados=0;const m=await montar(<FormularioConfiguracionSitio datos={{clave:'marcas_presentacion',empresaId:null,valor:'carrusel',activo:true,tipo:'texto'}} editar guardar={async()=>{guardados++}} ocupado={false} cancelar={()=>{}}/>,async()=>json(pagina([marca])))
 try{assert.ok(document.querySelector('.modo-carrusel'));const selector=[...document.querySelectorAll('select')].find(e=>e.querySelector('option[value="todas"]'))!;await cambiar(selector,'todas');assert.ok(document.querySelector('.modo-todas'));assert.equal(guardados,0);await act(async()=>document.querySelector('form')!.dispatchEvent(new window.Event('submit',{bubbles:true,cancelable:true})));assert.equal(guardados,1)}finally{await m.cerrar()}
})
test('marcas abiertas reciben la revisión de otra pestaña sin recarga',async()=>{
 const m=await montar(<MarcasInicio modoInicial="carrusel"/>,async u=>json(String(u).includes('/configuracion')?{marcas:{presentacion:'todas'}}:pagina([marca])))
 try{assert.ok(document.querySelector('.modo-carrusel'));await act(async()=>window.dispatchEvent(new window.StorageEvent('storage',{key:revisionPublicaClave,newValue:'revision'})));assert.ok(document.querySelector('.modo-todas'))}finally{await m.cerrar()}
})
test('marcas carga también los registros publicados posteriores al veinte',async()=>{
 invalidarCachePublica();const antes=globalThis.fetch;let pedidos=0
 globalThis.fetch=async u=>{pedidos++;const segundo=String(u).includes('desplazamiento=100');return json(pagina(segundo?[{...marca,id:'101'}]:Array.from({length:100},(_,i)=>({...marca,id:String(i+1)})),!segundo))}
 try{assert.equal((await marcasInicio()).length,101);assert.equal(pedidos,2)}finally{globalThis.fetch=antes;invalidarCachePublica()}
})
test('configuración pública usa prioridad de empresa y carrusel por defecto',async()=>{
 let consulta:any;let filas=[{id:1,empresaId:null,clave:'marcas_presentacion',valor:'carrusel'},{id:2,empresaId:42n,clave:'marcas_presentacion',valor:'todas'}]
 const repo=new PrismaPublicoConfiguracion({configuracionSitio:{findMany:async(c:unknown)=>{consulta=c;return filas}}} as never)
 assert.equal((await repo.obtener(42n)).marcas.presentacion,'todas');assert.equal(consulta.where.activo,true);assert.ok(consulta.where.clave.in.includes('marcas_presentacion'));assert.ok(!consulta.where.clave.in.includes('secreto'));filas=[];assert.equal((await repo.obtener(42n)).marcas.presentacion,'carrusel')
})
test('CMS rechaza modos inválidos sin cambiar valor ni versión',()=>{
 const d={id:1,empresaId:42n,clave:'marcas_presentacion',valor:'carrusel',tipo:'texto',descripcion:null,grupo:'inicio',activo:true,creadoEn:null,actualizadoEn:new Date('2026-10-01')}
 assert.throws(()=>new ConfiguracionSitio({...d,valor:'incorrecto'}));const e=new ConfiguracionSitio(d);assert.throws(()=>e.editar({valor:'incorrecto',tipo:'texto',descripcion:null,grupo:'inicio'},new Date('2026-10-02')));assert.equal(e.valor,'carrusel');assert.equal(e.actualizadoEn?.toISOString(),d.actualizadoEn.toISOString())
})
test('resúmenes filtran relaciones publicables y convierten sus IDs',async()=>{
 let consulta:any;const repo=new PrismaPublicoProductos({producto:{findMany:async(c:unknown)=>{consulta=c;return [{...p,id:80n,relCategoria:[{...p.categorias[0],id:9n}],relProductoMarca:[{marca:{...marca,id:5n}}]}]}}} as never)
 const r=await repo.obtener(42n,{limite:12,desplazamiento:0});assert.equal(r.items[0].marcas?.[0].id,'5');assert.equal(r.items[0].categorias?.[0].id,'9');assert.equal(consulta.where.empresaId,42n);assert.equal(consulta.select.relCategoria.where.estado,'activo');assert.equal(consulta.select.relProductoMarca.where.estado,'activo');assert.equal(consulta.select.relProductoMarca.where.marca.eliminadoEn,null)
})
test('hero conserva el fondo anterior hasta cargar el siguiente',async()=>{
 const s={id:'1',tipo:'hero',titulo:'Primero',subtitulo:null,descripcion:null,icono:null,imagen:'/a.jpg',metadata:{},orden:1};const m=await montar(<HeroPublico empresa="Empresa" slides={[s,{...s,id:'2',titulo:'Segundo',imagen:'/b.jpg'}]}/>,async()=>json({}))
 try{await click(document.querySelector('[aria-label="Siguiente"]')!);assert.equal(document.querySelector('.publico-hero-fondo:not(.publico-hero-entrante)')?.getAttribute('src'),'/a.jpg');assert.ok(document.querySelector('.publico-hero-entrante'));assert.ok(!document.querySelector('.publico-hero-entrante.lista'));await act(async()=>document.querySelector('.publico-hero-entrante')!.dispatchEvent(new window.Event('load')));assert.ok(document.querySelector('.publico-hero-entrante.lista'));assert.equal(document.querySelector('h1')?.textContent,'Segundo')}finally{await m.cerrar()}
})
test('mapas aceptan solo fuentes HTTPS de proveedores permitidos',()=>{
 assert.equal(mapaSucursal('<iframe src="https://www.google.com/maps/embed?pb=1"></iframe>'),'https://www.google.com/maps/embed?pb=1');assert.equal(mapaSucursal('<iframe src="javascript:alert(1)"></iframe>'),null);assert.equal(mapaSucursal('https://evil.test/maps/embed'),null);assert.equal(mapaSucursal('https://www.google.com/otra-ruta'),null)
})

test('listado pagina después de filtrar y conserva la vista de lista',async()=>{
 const items=Array.from({length:13},(_,i)=>({...p,id:String(i+1),nombre:'Producto '+i,marcas:i===12?[marca]:[]}))
 const m=await montar(<CatalogoPublico ruta="/products" datos={datos}/>,async()=>json(pagina(items)),'/products')
 try{assert.equal(document.querySelectorAll('.catalogo-tarjeta').length,12);await click([...document.querySelectorAll('button')].find(b=>b.textContent==='Siguiente')!);assert.equal(document.querySelectorAll('.catalogo-tarjeta').length,1);await cambiar([...document.querySelectorAll('select')].find(e=>e.querySelector('option[value="5"]'))!,'5');assert.equal(document.querySelectorAll('.catalogo-tarjeta').length,1);assert.ok(document.body.textContent?.includes('Producto 12'));await click(document.querySelector('[aria-label="Vista lista"]')!);assert.ok(document.querySelector('.catalogo-lista'))}finally{await m.cerrar()}
})
test('cambiar la búsqueda cancela las solicitudes anteriores e ignora respuestas tardías',async()=>{
 function Cambiar(){const [,set]=useSearchParams();return <button id="cambiar-busqueda" onClick={()=>set({q:'rodamientos'})}>Cambiar consulta</button>}
 let resolver!:(r:Response)=>void,signal:AbortSignal|undefined
 const m=await montar(<><CatalogoPublico ruta="/search" datos={datos}/><Cambiar/></>,async(u,o)=>{const url=String(u);if(url.includes('/productos')&&url.includes('q=correas')){signal=o?.signal??undefined;return new Promise<Response>(r=>resolver=r)}return json(url.includes('/productos')?pagina([{...p,nombre:'Rodamientos'}]):pagina([]))},'/search?q=correas')
 try{await click(document.getElementById('cambiar-busqueda')!);assert.equal(signal?.aborted,true);await act(async()=>resolver(json(pagina([{...p,nombre:'Respuesta antigua'}]))));assert.ok(document.body.textContent?.includes('Rodamientos'));assert.ok(!document.body.textContent?.includes('Respuesta antigua'))}finally{await m.cerrar()}
})
