import assert from 'node:assert/strict'
import { test } from 'node:test'
import { JSDOM } from 'jsdom'
import React,{act} from 'react'
const dom=new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>',{url:'http://localhost:3000/portal/catalogo/categorias/2/gama'})
Object.assign(globalThis,{window:dom.window,document:dom.window.document,HTMLElement:dom.window.HTMLElement,HTMLInputElement:dom.window.HTMLInputElement,HTMLSelectElement:dom.window.HTMLSelectElement,Event:dom.window.Event,MouseEvent:dom.window.MouseEvent,React,IS_REACT_ACT_ENVIRONMENT:true})
Object.defineProperty(globalThis,'navigator',{value:dom.window.navigator,configurable:true})
dom.window.HTMLDialogElement.prototype.showModal=function(){this.open=true}
dom.window.HTMLDialogElement.prototype.close=function(){this.open=false}
dom.window.confirm=()=>true
const {createRoot}=await import('react-dom/client')
const {MemoryRouter}=await import('react-router-dom')
const {AdministracionGama}=await import('../src/frontend/features/catalog/presentation/vista-gama-categoria')
const {FormularioCatalogo}=await import('../src/frontend/features/catalog/presentation/formulario-catalogo')
const {gamasApi}=await import('../src/frontend/features/catalog/api/gamas')
const fecha='2026-10-10T12:00:00.000Z',fecha2='2026-10-10T12:00:00.001Z'
const comunes={estado:'activo',creadoEn:fecha,actualizadoEn:fecha,eliminadoEn:null}
const atributo=(id:string,tipoDato:string,nombre:string)=>({id,tipoDato,nombre,tipoAtributoId:'1',valores:{descripcion:null,valorNumerico:null,unidadMedida:null},orden:1,...comunes})
const atributos=[atributo('21','numero','Ancho'),atributo('22','booleano','Reforzada'),atributo('23','texto','Material')]
const inicial=()=>({id:'9',categoriaId:'2',productoId:'1',gamaOrigenId:null,titulo:'Gama A',descripcion:null,imagen:null,version:fecha,...comunes,gruposColumnas:[],gruposFilas:[],columnas:atributos.map((a,i)=>({id:String(i+1),gamaId:'9',atributoId:a.id,tipoDato:a.tipoDato,grupoId:null,etiqueta:null,unidadMedida:null,orden:i+1,...comunes})),filas:[{id:'10',gamaId:'9',codigo:'a',nombre:'A',grupoId:null,descripcion:null,enlaceDetalle:null,orden:1,...comunes}],valores:[{filaId:'10',columnaId:'1',valor:{tipo:'numero',valor:'0'}},{filaId:'10',columnaId:'2',valor:{tipo:'booleano',valor:false}},{filaId:'10',columnaId:'3',valor:{tipo:'texto',valor:''}}]})
type Llamada={url:string;metodo:string;datos:Record<string,unknown>|undefined;headers:Headers}
async function montar({gestionar=true,vacia=false,conflicto=false}={}) {
 let gama=inicial(),existe=!vacia;const llamadas:Llamada[]=[]
 const anterior=globalThis.fetch
 globalThis.fetch=async(url,opts)=>{
  const ruta=String(url),metodo=opts?.method??'GET',datos=opts?.body?JSON.parse(String(opts.body)):undefined;llamadas.push({url:ruta,metodo,datos,headers:new Headers(opts?.headers)})
  let resultado:unknown;let estado=200
  if(ruta.endsWith('/capacidades'))resultado={verEliminados:false,recursos:Object.fromEntries(['categorias','atributos-tecnicos'].map(k=>[k,{leer:true,gestionar}]))}
  else if(ruta==='/api/portal/catalogo/categorias/2')resultado={id:'2',productoId:'1',nombre:'Correas',...comunes}
  else if(ruta.includes('/atributos-tecnicos?'))resultado=atributos
  else if(ruta.includes('/atributos-tecnicos/'))resultado=atributos.find(a=>ruta.endsWith('/'+a.id))
  else if(ruta.endsWith('/categorias/2/gama')){resultado=existe?gama:{error:'Gama no disponible'};estado=existe?200:404}
  else if(ruta.endsWith('/plantilla-gama'))resultado=metodo==='GET'?{plantilla:{productoId:'1',gamaId:'9',version:fecha,creadoEn:fecha}}:{ok:true}
  else if(ruta.includes('/gamas?'))resultado=[{...gama,categoriaId:'3'}]
  else if(ruta.endsWith('/gamas/9')&&metodo==='GET')resultado={...gama,categoriaId:'3'}
  else if(ruta.endsWith('/valores')){
   if(conflicto){estado=409;resultado={error:'Gama modificada por otra operación'}}else{for(const c of datos.cambios){const i=gama.valores.findIndex(v=>v.filaId===c.filaId&&v.columnaId===c.columnaId);if(i>=0)gama.valores.splice(i,1);if(c.valor!==null)gama.valores.push(c)}gama={...gama,version:fecha2};resultado={gamaId:'9',version:fecha2,resultado:datos.cambios.length}}
  }else if(ruta.endsWith('/copiar')){existe=true;gama={...gama,version:fecha2};resultado={gamaId:'9',version:fecha2,resultado:{}};estado=201}
  else if(conflicto&&metodo==='POST'&&ruta.endsWith('/filas')){estado=409;resultado={error:'Gama modificada por otra operación'}}
  else if(metodo!=='GET')resultado={gamaId:'9',version:fecha2,resultado:'5'}
  else throw new Error(`Ruta inesperada ${ruta}`)
  return new Response(JSON.stringify(resultado),{status:estado,headers:{'content-type':'application/json'}})
 }
 const nodo=document.getElementById('root')!,root=createRoot(nodo)
 await act(async()=>{root.render(<MemoryRouter future={{v7_startTransition:true,v7_relativeSplatPath:true}}><AdministracionGama categoriaId="2"/></MemoryRouter>)})
 await esperar(()=>!!document.querySelector('h1')?.textContent?.includes('Correas'))
 return {llamadas,render:async(elemento:React.ReactNode)=>{await act(async()=>root.render(elemento))},cerrar:async()=>{await act(async()=>root.unmount());globalThis.fetch=anterior}}
}
async function esperar(condicion:()=>boolean){for(let i=0;i<100;i++){if(condicion())return;await act(async()=>{await new Promise(r=>setTimeout(r,10))})}assert.fail('La interfaz no alcanzó el estado esperado')}
const boton=(texto:string)=>{const b=[...document.querySelectorAll('button')].find(b=>b.textContent?.trim()===texto);assert.ok(b,`Botón ${texto}`);return b}
async function click(b:HTMLElement){await act(async()=>{b.click()})}
async function valor(nodo:HTMLInputElement|HTMLSelectElement,valor:string){await act(async()=>{const proto=nodo.tagName==='SELECT'?dom.window.HTMLSelectElement.prototype:dom.window.HTMLInputElement.prototype;Object.getOwnPropertyDescriptor(proto,'value')!.set!.call(nodo,valor);nodo.dispatchEvent(new dom.window.Event(nodo.tagName==='SELECT'?'change':'input',{bubbles:true}))})}

test('administración: vista de consulta sin controles de escritura',async()=>{const t=await montar({gestionar:false});try{assert.ok(document.body.textContent?.includes('Vista de consulta'));assert.equal(document.querySelectorAll('input[type="checkbox"]').length,0);assert.ok(![...document.querySelectorAll('button')].some(b=>b.textContent==='Editar gama'));assert.equal(t.llamadas.filter(l=>l.metodo!=='GET').length,0)}finally{await t.cerrar()}})

test('administración: conserva cero, false, texto vacío y precisión en el guardado por lote',async()=>{const t=await montar();try{
 const num=document.querySelector<HTMLInputElement>('input[aria-label="A · Ancho"]')!,bool=document.querySelector<HTMLSelectElement>('select[aria-label="A · Reforzada"]')!,texto=document.querySelector<HTMLInputElement>('input[aria-label="A · Material"]')!
 assert.equal(num.value,'0');assert.equal(bool.value,'false');assert.equal(texto.value,'');assert.ok([...document.querySelectorAll<HTMLInputElement>('input[type="checkbox"]')].every(c=>!c.checked))
 await valor(num,'12345678901234567890.123456789');await click(boton('Guardar valores (1)'))
 const put=t.llamadas.find(l=>l.metodo==='PUT')!;assert.equal(put.datos!.version,fecha);assert.deepEqual(put.datos!.cambios,[{filaId:'10',columnaId:'1',valor:{tipo:'numero',valor:'12345678901234567890.123456789'}}]);assert.equal(put.headers.get('X-Portal-Request'),'1')
 assert.ok(boton('Guardar valores (0)').disabled)
 await valor(document.querySelector<HTMLInputElement>('input[aria-label="A · Ancho"]')!,'12');await click(boton('Guardar valores (1)'))
 assert.equal(t.llamadas.filter(l=>l.metodo==='PUT').at(-1)!.datos!.version,fecha2)
}finally{await t.cerrar()}})

test('administración: conflicto preserva borrador y exige recarga explícita',async()=>{const t=await montar({conflicto:true});try{
 await valor(document.querySelector<HTMLInputElement>('input[aria-label="A · Ancho"]')!,'55');await click(boton('Guardar valores (1)'))
 assert.ok(document.body.textContent?.includes('Recarga la gama'));assert.equal(document.querySelector<HTMLInputElement>('input[aria-label="A · Ancho"]')!.value,'55');assert.ok(boton('Guardar valores (1)').disabled)
 await click(boton('Recargar'));assert.equal(document.querySelector<HTMLInputElement>('input[aria-label="A · Ancho"]')!.value,'0');assert.ok(boton('Guardar valores (0)').disabled)
}finally{await t.cerrar()}})

test('administración: copia independiente con filas/valores opcionales y versión del origen',async()=>{const t=await montar({vacia:true});try{
 await click(boton('Plantillas'));await esperar(()=>!!document.body.textContent?.includes('Vista previa:'))
 const checks=[...document.querySelectorAll<HTMLInputElement>('input[type="checkbox"]')];assert.equal(checks.length,3);assert.ok(checks[1]!.disabled)
 await click(checks[0]!);await click(checks[1]!);await click(boton('Crear gama desde este origen'))
 const copia=t.llamadas.find(l=>l.url.endsWith('/copiar'))!;assert.deepEqual(copia.datos,{categoriaId:'2',copiarFilas:true,copiarValores:true,copiarEnlaces:false,origenId:'9',versionOrigen:fecha})
 assert.ok(document.body.textContent?.includes('Esta categoría ya tiene una gama'))
}finally{await t.cerrar()}})

test('cliente API: retirada de plantilla usa DELETE y versión de referencia',async()=>{const t=await montar();try{await gamasApi.quitar('1',fecha);const ultima=t.llamadas.at(-1)!;assert.equal(ultima.metodo,'DELETE');assert.deepEqual(ultima.datos,{version:fecha});assert.equal(ultima.headers.get('X-Portal-Request'),'1')}finally{await t.cerrar()}})

test('administración: conflicto en modal permite cerrarlo y recargar',async()=>{const t=await montar({conflicto:true});try{
 await click(boton('Estructura'));await click(boton('Agregar fila'))
 const dialog=document.querySelector('dialog')!;assert.ok(dialog.open)
 const inputs=dialog.querySelectorAll<HTMLInputElement>('input');await valor(inputs[0]!,'fila-b');await valor(inputs[1]!,'Fila B')
 await act(async()=>{dialog.querySelector('form')!.dispatchEvent(new dom.window.Event('submit',{bubbles:true,cancelable:true}))})
 assert.ok(dialog.textContent?.includes('Recarga la gama'));const cerrar=dialog.querySelector<HTMLButtonElement>('button[aria-label="Cerrar ventana"]')!;assert.equal(cerrar.disabled,false)
 await click(cerrar);assert.equal(document.querySelector('dialog'),null);await click(boton('Recargar'));assert.equal(boton('Agregar fila').disabled,false)
}finally{await t.cerrar()}})

test('asignaciones: el formulario edita booleano false sin transformarlo en null',async()=>{const t=await montar();try{
 let recibido:unknown
 const registro={id:'1',categoriaId:'2',atributoId:'22',tipoDato:'booleano' as const,valor:{tipo:'booleano' as const,valor:false},valorPersonalizado:null,orden:0,...comunes,estado:'activo' as const}
 await t.render(<FormularioCatalogo registro={registro} cerrar={()=>{}} guardado={()=>{}} config={{recurso:'asignaciones-atributo',titulo:'Atributos',descripcion:'',columnas:[],campos:[{clave:'atributoId',etiqueta:'Atributo',soloCrear:true},{clave:'valor',etiqueta:'Valor',tipo:'valor-tecnico'},{clave:'orden',etiqueta:'Orden',tipo:'number'}],listar:async()=>[],obtener:async()=>registro,crear:async()=>registro,editar:async(_id,datos)=>{recibido=datos;return registro},cambiar:async()=>({ok:true})}}/>)
 await esperar(()=>!!document.querySelector('select[aria-label="Valor"]'))
 assert.equal(document.querySelector<HTMLSelectElement>('select[aria-label="Valor"]')!.value,'false')
 await click(boton('Guardar'));assert.deepEqual(recibido,{valor:{tipo:'booleano',valor:false},orden:0})
}finally{await t.cerrar()}})

test('administración: un decimal inválido no se envía y Sin valor envía null',async()=>{const t=await montar();try{
 await valor(document.querySelector<HTMLInputElement>('input[aria-label="A · Ancho"]')!,'1,25');await click(boton('Guardar valores (1)'));assert.equal(t.llamadas.filter(l=>l.metodo==='PUT').length,0);assert.ok(document.body.textContent?.includes('Usa un decimal con punto'))
 const sinValor=document.querySelector<HTMLInputElement>('input[type="checkbox"]')!;await click(sinValor);await click(boton('Guardar valores (1)'))
 assert.deepEqual(t.llamadas.find(l=>l.metodo==='PUT')!.datos!.cambios,[{filaId:'10',columnaId:'1',valor:null}]);assert.equal(document.querySelector<HTMLInputElement>('input[aria-label="A · Ancho"]')!.disabled,true)
}finally{await t.cerrar()}})

test('administración: movimiento usa ID del hijo, posición y versión de gama',async()=>{const t=await montar();try{
 await click(boton('Estructura'));const seccion=[...document.querySelectorAll('section')].find(s=>s.querySelector('h2')?.textContent==='Filas / variantes')!;assert.ok(seccion)
 const orden=[...seccion.querySelectorAll('button')].find(b=>b.textContent==='Orden')!;await click(orden);await click(boton('Confirmar'))
 const patch=t.llamadas.find(l=>l.url.endsWith('/filas/10/orden'))!;assert.equal(patch.metodo,'PATCH');assert.deepEqual(patch.datos,{version:fecha,posicion:1})
}finally{await t.cerrar()}})
