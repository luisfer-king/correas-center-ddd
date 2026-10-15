import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import type { SeccionPublicada } from '../../../../shared/publico/cms'
const Contenido=lazy(()=>import('./bloque-cms-contenido').then(m=>({default:m.BloqueCmsContenido})))
export function BloqueCmsInicio(props:{titulo:string;subtitulo:string;items:SeccionPublicada[];oscuro?:boolean}) {
 const [visible,setVisible]=useState(false),ref=useRef<HTMLDivElement>(null)
 useEffect(()=>{if(!props.items.length)return;if(typeof IntersectionObserver==='undefined'){setVisible(true);return}const observer=new IntersectionObserver(e=>{if(e.some(x=>x.isIntersecting)){setVisible(true);observer.disconnect()}},{rootMargin:'350px'});if(ref.current)observer.observe(ref.current);return()=>observer.disconnect()},[props.items.length])
 if(!props.items.length)return null
 const espera=<section className="publico-bloque-inicio"><div className="publico-inicio-contenedor"><h2>{props.titulo}</h2><p role="status">Cargando contenido…</p></div></section>
 return <div ref={ref}>{visible?<Suspense fallback={espera}><Contenido {...props} /></Suspense>:espera}</div>
}
