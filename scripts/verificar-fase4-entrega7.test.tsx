import assert from 'node:assert/strict'
import {test} from 'node:test'
import {registerHooks} from 'node:module'
import {JSDOM} from 'jsdom'
const dom=new JSDOM('<div id="root"></div>',{url:'https://correas.test/'})
Object.assign(globalThis,{window:dom.window,document:dom.window.document,HTMLElement:dom.window.HTMLElement,IS_REACT_ACT_ENVIRONMENT:true})
registerHooks({load(url,c,next){return url.endsWith('.css')?{format:'module',source:'',shortCircuit:true}:next(url,c)}})
const React=await import('react');Object.assign(globalThis,{React});const {act}=React
const {createRoot}=await import('react-dom/client')
const {MemoryRouter,useLocation}=await import('react-router-dom')
const {FormularioContactoPublico}=await import('../src/frontend/features/publico/presentation/formulario-contacto-publico')
const {SuscripcionPublica}=await import('../src/frontend/features/publico/presentation/suscripcion-publica')
const {AsistentePublico}=await import('../src/frontend/features/publico/presentation/asistente-publico')
const {invalidarCachePublica}=await import('../src/frontend/features/publico/api/cache-publica')
const {configuracionAsistenteValida,opcionesAsistente}=await import('../src/frontend/features/publico/presentation/datos-asistente-publico')
const pasos=[{id:'1',identificador:'sector',fuenteDatos:'industrias',titulo:'Tu industria',descripcion:'Elige sector',campoFiltro:null,orden:1},{id:'2',identificador:'producto',fuenteDatos:'productos',titulo:'Productos',descripcion:'Elige productos',campoFiltro:null,orden:2},{id:'3',identificador:'categoria',fuenteDatos:'categorias',titulo:'Categorías',descripcion:'Elige categorías',campoFiltro:'producto_id',orden:3}]
const productos=[{id:'1',nombre:'Correas',slug:'correas',categorias:[{id:'10',nombre:'Trapezoidales'}]},{id:'2',nombre:'Mangueras',slug:'mangueras',categorias:[{id:'20',nombre:'Hidráulicas'}]}]
const datos:any={configuracion:{whatsapp:{activo:true,numero:'59170000000',mensaje:''}}}
const json=(d:unknown,status=200)=>new Response(JSON.stringify(d),{status,headers:{'content-type':'application/json'}})
async function montar(el:React.ReactNode,fetcher:typeof fetch){invalidarCachePublica();const old=globalThis.fetch;globalThis.fetch=fetcher;const root=createRoot(document.getElementById('root')!);await act(async()=>{root.render(<MemoryRouter future={{v7_startTransition:true,v7_relativeSplatPath:true}}>{el}</MemoryRouter>);await new Promise(r=>setTimeout(r,20))});return async()=>{await act(async()=>root.unmount());globalThis.fetch=old;invalidarCachePublica()}}
async function click(texto:string){const b=[...document.querySelectorAll('button,a')].find(b=>b.textContent?.trim()===texto);assert.ok(b,'Falta '+texto);await act(async()=>{b.dispatchEvent(new window.MouseEvent('click',{bubbles:true,cancelable:true,button:0}));await new Promise(r=>setTimeout(r,20))})}
async function llenar(selector:string,valor:string){const e=document.querySelector(selector) as HTMLInputElement;assert.ok(e);await act(async()=>{const proto=e.tagName==='TEXTAREA'?dom.window.HTMLTextAreaElement.prototype:dom.window.HTMLInputElement.prototype;Object.getOwnPropertyDescriptor(proto,'value')!.set!.call(e,valor);e.dispatchEvent(new window.Event('input',{bubbles:true}))})}
async function enviar(){await act(async()=>{document.querySelector('form')!.dispatchEvent(new window.Event('submit',{bubbles:true,cancelable:true}));await new Promise(r=>setTimeout(r,20))})}
test('contacto conserva datos ante error, reintenta y limpia al recibir confirmación',async()=>{
 let llamadas=0;const cuerpos:any[]=[];const cerrar=await montar(<FormularioContactoPublico mensajeInicial="Selección del asistente"/>,async(_,o)=>{cuerpos.push(JSON.parse(String(o?.body)));return ++llamadas===1?json({error:'Fallo temporal'},500):json({recibido:true},202)})
 try{await llenar('[name="nombre"]','Luis');await llenar('[name="telefono"]','70000000');await llenar('[name="email"]','luis@example.test');await act(async()=>{document.querySelector<HTMLInputElement>('[type=checkbox]')!.click()});await enviar();assert.match(document.body.textContent!,/Fallo temporal/);assert.equal(document.querySelector<HTMLInputElement>('[name=nombre]')!.value,'Luis');await enviar();assert.deepEqual(cuerpos[0],cuerpos[1]);assert.equal(cuerpos[1].consentimiento,true);assert.equal(cuerpos[1].mensaje,'Selección del asistente');assert.equal(document.querySelector<HTMLInputElement>('[name=nombre]')!.value,'');assert.match(document.body.textContent!,/Recibimos tu consulta/)}finally{await cerrar()}
})
test('suscripción exige consentimiento en HTML y envía solo datos públicos',async()=>{let enviado:any;const cerrar=await montar(<SuscripcionPublica/>,async(_,o)=>{enviado=JSON.parse(String(o?.body));return json({recibido:true},202)});try{assert.ok(document.querySelector<HTMLInputElement>('[type=checkbox]')!.required);await llenar('[type=email]','boletin@example.test');await act(async()=>{document.querySelector<HTMLInputElement>('[type=checkbox]')!.click()});await enviar();assert.deepEqual(enviado,{email:'boletin@example.test',consentimiento:true,sitioWeb:''});assert.match(document.body.textContent!,/Recibimos tu solicitud/)}finally{await cerrar()}})
test('configuración del asistente valida fuentes, orden de dependencia e identificadores',()=>{
 assert.equal(configuracionAsistenteValida(pasos),true);assert.equal(configuracionAsistenteValida([pasos[2],pasos[1]]),false);assert.equal(configuracionAsistenteValida([pasos[0],pasos[0]]),false);assert.equal(configuracionAsistenteValida([{...pasos[0],fuenteDatos:'tabla_privada'}]),false)
 const opciones=opcionesAsistente(pasos[2],pasos,{producto:[{id:'2',nombre:'Mangueras'}]},{productos,industrias:[],servicios:[]} as any);assert.deepEqual(opciones.map(o=>o.id),['20'])
})
function EstadoRuta(){return <output>{JSON.stringify(useLocation().state)}</output>}
test('asistente carga catálogo bajo demanda, filtra categorías y lleva resumen a Contacto',async()=>{
 const llamadas:string[]=[];const cerrar=await montar(<><AsistentePublico datos={datos}/><EstadoRuta/></>,async url=>{const u=String(url);llamadas.push(u);return json({items:u.includes('pasos-wizard')?pasos:u.includes('industrias')?[{id:'8',nombre:'Minería'}]:productos,hayMas:false})})
 try{assert.ok(!llamadas.some(u=>u.includes('/productos')));await click('Empezar');await click('Minería');await click('Continuar');await click('Correas');await click('Continuar');assert.match(document.body.textContent!,/Trapezoidales/);assert.ok(!document.body.textContent!.includes('Hidráulicas'));await click('CorreasTrapezoidales');await click('Ver selección');const wa=document.querySelector<HTMLAnchorElement>('a[href^="https://wa.me"]')!;assert.ok(decodeURIComponent(wa.href).includes('Trapezoidales'));await click('Enviar consulta');assert.match(document.querySelector('output')!.textContent!,/Minería/);assert.match(document.querySelector('output')!.textContent!,/Trapezoidales/)}finally{await cerrar()}
})
test('al cambiar producto se descartan categorías posteriores',async()=>{
 const cerrar=await montar(<AsistentePublico datos={datos}/>,async url=>json({items:String(url).includes('pasos-wizard')?pasos:String(url).includes('industrias')?[{id:'8',nombre:'Minería'}]:productos,hayMas:false}))
 try{await click('Empezar');await click('Minería');await click('Continuar');await click('Correas');await click('Continuar');await click('CorreasTrapezoidales');await click('Anterior');await click('Correas');await click('Mangueras');await click('Continuar');assert.ok(!document.body.textContent!.includes('Trapezoidales'));assert.ok(document.body.textContent!.includes('Hidráulicas'));assert.equal(document.querySelector('button[aria-pressed=true]'),null)}finally{await cerrar()}
})
