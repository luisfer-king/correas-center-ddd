import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import type { MarcaPublica } from '../../../../shared/publico/catalogo'
import type { PresentacionMarcas } from '../../../../shared/publico/cms'
import { imagenPublica } from './imagen-publica'
import './marcas-presentacion.css'

export function posicionCarrusel(posicion:number,ancho:number) {
 if(ancho<=0)return posicion
 return posicion>=2*ancho?posicion-ancho:posicion<ancho?posicion+ancho:posicion
}
export function MarcasPresentacion({marcas,modo}:{marcas:MarcaPublica[];modo:PresentacionMarcas}) {
 const pista=useRef<HTMLDivElement>(null),grupo=useRef<HTMLDivElement>(null),manualHasta=useRef(0)
 const [pausa,setPausa]=useState(false),[interaccion,setInteraccion]=useState(false),[enfocado,setEnfocado]=useState(false),[arrastrando,setArrastrando]=useState(false),[velocidad,setVelocidad]=useState(35),[repeticiones,setRepeticiones]=useState(1)
 const infinito=modo==='carrusel'&&marcas.length>1
 useEffect(()=>{
  const e=pista.current;if(!e||!infinito)return
  const medir=()=>setRepeticiones(Math.max(1,Math.ceil(e.clientWidth/(marcas.length*200))))
  medir();if(typeof ResizeObserver==='undefined')return
  const observer=new ResizeObserver(medir);observer.observe(e);return()=>observer.disconnect()
 },[infinito,marcas.length])
 useEffect(()=>{if(infinito&&pista.current&&grupo.current)pista.current.scrollLeft=grupo.current.scrollWidth},[infinito,marcas.length,repeticiones])
 useEffect(()=>{
  if(!infinito||pausa||interaccion||enfocado||arrastrando||typeof window.requestAnimationFrame!=='function')return
  const reducido=window.matchMedia?.('(prefers-reduced-motion: reduce)');if(reducido?.matches)return
  let frame=0,anterior=0,vivo=true
  const actualizar=(ahora:number)=>{
   const e=pista.current,ancho=grupo.current?.scrollWidth??0
   if(e&&ancho>0&&anterior&&document.visibilityState!=='hidden'&&Date.now()>manualHasta.current&&!reducido?.matches)e.scrollLeft=posicionCarrusel(e.scrollLeft+Math.min(ahora-anterior,80)*velocidad/1000,ancho)
   anterior=ahora;if(vivo)frame=window.requestAnimationFrame(actualizar)
  }
  frame=window.requestAnimationFrame(actualizar);return()=>{vivo=false;window.cancelAnimationFrame(frame)}
 },[infinito,pausa,interaccion,enfocado,arrastrando,velocidad,repeticiones])
 useEffect(()=>{if(!arrastrando)return;const soltar=()=>{setArrastrando(false);manualHasta.current=Date.now()+1800};window.addEventListener('pointerup',soltar);window.addEventListener('pointercancel',soltar);return()=>{window.removeEventListener('pointerup',soltar);window.removeEventListener('pointercancel',soltar)}},[arrastrando])
 function mover(direccion:number){const e=pista.current;if(!e)return;manualHasta.current=Date.now()+2000;const ancho=grupo.current?.scrollWidth??0;if(infinito)e.scrollLeft=posicionCarrusel(e.scrollLeft,ancho);e.scrollBy?.({left:direccion*200,behavior:window.matchMedia?.('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})}
 function logo(m:MarcaPublica,clave:string,duplicada=false){return <div key={clave} className="marca-logo" title={m.nombre}>{imagenPublica(m.logo)?<img src={imagenPublica(m.logo)} alt={duplicada?'':m.nombre} width={160} height={90} loading="lazy" decoding="async" onError={e=>{e.currentTarget.hidden=true;e.currentTarget.nextElementSibling?.removeAttribute('hidden')}}/>:null}<span hidden={!!imagenPublica(m.logo)}>{m.nombre}</span></div>}
 return <div className={'marcas-presentacion modo-'+modo}>
  <div className="marcas-pista" ref={pista} tabIndex={modo==='carrusel'?0:undefined} aria-label="Marcas disponibles" onMouseEnter={()=>{if(window.matchMedia?.('(hover: hover) and (pointer: fine)').matches)setInteraccion(true)}} onMouseLeave={()=>setInteraccion(false)} onFocus={()=>setEnfocado(true)} onBlur={()=>setEnfocado(false)} onPointerDown={()=>setArrastrando(true)} onWheel={()=>{manualHasta.current=Date.now()+1800}} onKeyDown={e=>{if(modo==='carrusel'&&['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();mover(e.key==='ArrowRight'?1:-1)}}}>
   {infinito?[0,1,2].map(copia=><div className="marcas-grupo" ref={copia===0?grupo:undefined} key={copia} aria-hidden={copia!==1?true:undefined}>{Array.from({length:repeticiones},(_,r)=>marcas.map(m=>logo(m,copia+'-'+r+'-'+m.id,copia!==1||r!==0)))}</div>):marcas.map(m=>logo(m,m.id))}
  </div>{infinito&&<div className="marcas-controles"><button type="button" aria-label="Marcas anteriores" onClick={()=>mover(-1)}><ChevronLeft size={18}/></button><button type="button" aria-label={pausa?'Reanudar marcas':'Pausar marcas'} aria-pressed={pausa} onClick={()=>setPausa(p=>!p)}>{pausa?<Play size={16}/>:<Pause size={16}/>}</button><button type="button" aria-label="Marcas siguientes" onClick={()=>mover(1)}><ChevronRight size={18}/></button><label>Velocidad<select value={velocidad} onChange={e=>setVelocidad(Number(e.target.value))}><option value={20}>Suave</option><option value={35}>Normal</option><option value={70}>Rápida</option></select></label></div>}
 </div>
}
