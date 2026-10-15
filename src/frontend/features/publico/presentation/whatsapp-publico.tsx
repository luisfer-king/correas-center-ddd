import { useEffect, useRef } from 'react'
import { IconoRedSocial } from './icono-red-social'
import type { ConfiguracionPublica } from '../../../../shared/publico/cms'
import { enlaceWhatsApp } from './datos-marco-publico'
export function margenWhatsapp(altoVentana:number,inicioFooter:number,margen=24){return Math.max(margen,altoVentana-inicioFooter+margen)}
export function WhatsAppPublico({configuracion}:{configuracion:ConfiguracionPublica['whatsapp']}) {
 const url=enlaceWhatsApp(configuracion),boton=useRef<HTMLAnchorElement>(null)
 useEffect(()=>{
  if(!url)return
  let frame=0
  function medir(){frame=0;const footer=document.querySelector<HTMLElement>('.publico-footer');if(boton.current)boton.current.style.bottom=margenWhatsapp(window.innerHeight,footer?.getBoundingClientRect().top??Infinity,window.innerWidth<640?16:24)+'px'}
  function programar(){if(frame)return;if(typeof window.requestAnimationFrame==='function')frame=window.requestAnimationFrame(medir);else medir()}
  medir();window.addEventListener('scroll',programar,{passive:true});window.addEventListener('resize',programar)
  const observer=typeof ResizeObserver!=='undefined'?new ResizeObserver(programar):null;const marco=document.querySelector('.publico');if(marco)observer?.observe(marco)
  return()=>{if(frame)window.cancelAnimationFrame?.(frame);observer?.disconnect();window.removeEventListener('scroll',programar);window.removeEventListener('resize',programar)}
 },[url])
 return url?<a ref={boton} className="publico-whatsapp" href={url} target="_blank" rel="noopener noreferrer" aria-label="Consultar por WhatsApp"><IconoRedSocial nombre="faWhatsapp"/><span>WhatsApp</span></a>:null
}
