import assert from 'node:assert/strict'
import { test } from 'node:test'
import React, { act } from 'react'
import { createRoot } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import { JSDOM } from 'jsdom'
import { ModalSolucionesIndustria } from '../src/frontend/features/catalog/presentation/modal-soluciones-industria'
import { VistaIndustrias } from '../src/frontend/features/catalog/presentation/vista-industrias'
Object.assign(globalThis, { React })
const producto={id:'1',empresaId:'10',nombre:'Correas',estado:'activo'}
const categoria={id:'1',productoId:'1',nombre:'Trapezoidales',estado:'activo'}
const servicio={id:'1',empresaId:'10',nombre:'Reparación',estado:'activo'}
async function montar(gestionar=true, vista=false, falla=false) {
 const dom=new JSDOM('<div id="root"></div>',{url:'https://correas.test/'})
 dom.window.HTMLDialogElement.prototype.showModal=function(){this.open=true};dom.window.HTMLDialogElement.prototype.close=function(){this.open=false}
 Object.assign(globalThis,{window:dom.window,document:dom.window.document,HTMLElement:dom.window.HTMLElement,IS_REACT_ACT_ENVIRONMENT:true})
 const anterior=globalThis.fetch, llamadas:{url:string;metodo:string;cuerpo:any}[]=[], relaciones:any[]=[]
 globalThis.fetch=async(input,init)=>{
  const url=String(input),metodo=init?.method||'GET',cuerpo=init?.body?JSON.parse(String(init.body)):null
  llamadas.push({url,metodo,cuerpo});let data:any=[]
  if(falla&&url.includes('/categorias'))return new Response(JSON.stringify({error:'No autorizado'}),{status:403,headers:{'content-type':'application/json'}})
  if(metodo==='POST'){const a={id:String(relaciones.length+1),...cuerpo,estado:'activo'};relaciones.push(a);data=a}
  else if(metodo==='PATCH'){const id=url.split('/').at(url.endsWith('/inactivar')||url.endsWith('/activar')?-2:-1);const a=relaciones.find(r=>r.id===id);if(url.endsWith('/inactivar'))a.estado='inactivo';else if(url.endsWith('/activar'))a.estado='activo';else a.orden=cuerpo.orden;data={ok:true}}
  else if(url.includes('/capacidades'))data={recursos:{industrias:{leer:true,gestionar:true},'asignaciones-industria':{leer:false,gestionar}},verEliminados:false}
  else if(url.includes('/asignaciones-industria'))data=relaciones
  else if(url.includes('/productos'))data=[producto,{...producto,id:'2',empresaId:'20',nombre:'Ajeno'}]
  else if(url.includes('/categorias'))data=[categoria,{...categoria,id:'2',productoId:'2',nombre:'Ajena'}]
  else if(url.includes('/servicios'))data=[servicio,{...servicio,id:'2',empresaId:'20',nombre:'Ajeno'}]
  else if(url.includes('/industrias'))data=[{id:'8',empresaId:'10',nombre:'Minería',slug:'mineria',estado:'activo',orden:0}]
  return new Response(JSON.stringify(data),{headers:{'content-type':'application/json'}})
 }
 const root=createRoot(document.getElementById('root')!)
 await act(async()=>{root.render(<MemoryRouter future={{v7_startTransition:true,v7_relativeSplatPath:true}}>{vista?<VistaIndustrias/>:<ModalSolucionesIndustria industriaId="8" empresaId="10" nombre="Minería" puedeGestionar={gestionar} cerrar={()=>{}}/>}</MemoryRouter>);await new Promise(r=>setTimeout(r,15))})
 return {llamadas,relaciones,cerrar:async()=>{await act(async()=>root.unmount());globalThis.fetch=anterior;dom.window.close()}}
}
async function seleccionar(indice:number,valor:string){await act(async()=>{const s=document.querySelectorAll('form select')[indice] as HTMLSelectElement;s.value=valor;s.dispatchEvent(new window.Event('change',{bubbles:true}))})}
async function enviar(){await act(async()=>{document.querySelector('form')!.dispatchEvent(new window.Event('submit',{bubbles:true,cancelable:true}));await new Promise(r=>setTimeout(r,15))})}
async function boton(texto:string){await act(async()=>{const b=[...document.querySelectorAll('button')].find(b=>b.textContent===texto)!;assert.ok(b);b.dispatchEvent(new window.MouseEvent('click',{bubbles:true}));await new Promise(r=>setTimeout(r,15))})}
test('Industria ofrece acceso directo a sus productos y servicios',async()=>{const m=await montar(true,true);try{const fila=document.querySelector('tbody tr')!;const botones=[...fila.querySelectorAll('button')].map(b=>b.textContent);assert.equal(botones[botones.indexOf('Editar')-1],'Asignar');await boton('Asignar');assert.ok(document.querySelector('dialog'));assert.match(document.body.textContent!,/Productos y servicios · Minería/)}finally{await m.cerrar()}})
test('asigna categoría y servicio con el mismo ID sin confundir tipos ni empresas',async()=>{const m=await montar();try{
 assert.ok(!document.body.textContent!.includes('Ajeno'));await seleccionar(1,'1');await seleccionar(2,'1');await enviar()
 await seleccionar(0,'servicio');await seleccionar(1,'1');await enviar()
 const posts=m.llamadas.filter(l=>l.metodo==='POST');assert.equal(posts.length,2);assert.deepEqual(posts.map(p=>p.cuerpo.destino),[{tipo:'categoria',id:'1'},{tipo:'servicio',id:'1'}]);assert.ok(posts.every(p=>p.cuerpo.industriaId==='8'));assert.match(document.body.textContent!,/Correas · Trapezoidales/)
 await seleccionar(1,'1');assert.equal((document.querySelector('button[type="submit"]') as HTMLButtonElement).disabled,true)
}finally{await m.cerrar()}})
test('retira y reactiva la misma relación, sin crear duplicados',async()=>{const m=await montar();try{await seleccionar(0,'servicio');await seleccionar(1,'1');await enviar();await boton('Retirar');assert.equal(m.relaciones[0].estado,'inactivo');await boton('Reactivar');assert.equal(m.relaciones[0].estado,'activo');assert.equal(m.llamadas.filter(l=>l.metodo==='POST').length,1)}finally{await m.cerrar()}})
test('solo lectura y error de carga impiden guardar',async()=>{for(const [gestionar,falla] of [[false,false],[true,true]]){const m=await montar(gestionar,false,falla);try{assert.equal((document.querySelector('button[type="submit"]') as HTMLButtonElement).disabled,true);if(falla)assert.ok(document.querySelector('[role="alert"]'));assert.equal(m.llamadas.filter(l=>l.metodo==='POST').length,0)}finally{await m.cerrar()}}})
