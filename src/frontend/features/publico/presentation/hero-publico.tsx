import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import type { SeccionPublicada } from '../../../../shared/publico/cms'
import { enlacePublico } from '../../../../shared/publico/rutas'
import { imagenPublica } from './imagen-publica'
export function HeroPublico({slides,empresa}:{slides:SeccionPublicada[];empresa:string}) {
 const [indice,setIndice]=useState(0),[pausa,setPausa]=useState(false)
 const actual=slides[indice%Math.max(1,slides.length)]
 const imagen=imagenPublica(actual?.imagen??null)
 const [fondo,setFondo]=useState(imagen),[entrante,setEntrante]=useState<string|null>(null),[lista,setLista]=useState(false)
 useEffect(()=>{if(imagen && imagen!==fondo){setEntrante(imagen);setLista(false)}else{setEntrante(null);setLista(false)}},[imagen,fondo])
 useEffect(()=>{if(!entrante||!lista)return;const timer=window.setTimeout(()=>{setFondo(entrante);setEntrante(null);setLista(false)},900);return()=>window.clearTimeout(timer)},[entrante,lista])
 useEffect(()=>{if(slides.length<2||pausa||window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)return;const timer=setInterval(()=>setIndice(i=>(i+1)%slides.length),7000);return()=>clearInterval(timer)},[slides.length,pausa])
 if(!actual)return <section className="publico-hero-inicio"><div className="publico-inicio-contenedor"><h1>{empresa}</h1><p>Soluciones industriales de calidad.</p><Link className="publico-cta primary" to="/contact">Solicitar asesoría</Link></div></section>
 return <section className="publico-hero-inicio" aria-label="Presentación de la empresa" onFocusCapture={()=>setPausa(true)}>
  {fondo&&<img className="publico-hero-fondo" src={fondo} alt="" width={1920} height={1080} loading="eager" fetchPriority="high" decoding="async" />}{entrante&&<img key={entrante} className={'publico-hero-fondo publico-hero-entrante '+(lista?'lista':'')} src={entrante} alt="" width={1920} height={1080} decoding="async" onLoad={()=>setLista(true)} onError={()=>setEntrante(null)}/>}<div className="publico-hero-sombra" />
  <div key={actual.id} className="publico-inicio-contenedor publico-hero-texto">{typeof actual.metadata.badge_text==='string'&&<span className="publico-hero-etiqueta">{actual.metadata.badge_text}</span>}<h1>{actual.titulo||empresa}</h1>{actual.subtitulo&&<p>{actual.subtitulo}</p>}{actual.descripcion&&<p>{actual.descripcion}</p>}
   <div className="publico-acciones">{['primary','secondary'].map(tipo=>{const texto=actual.metadata['cta_'+tipo+'_text'],ruta=enlacePublico(actual.metadata['cta_'+tipo+'_href'],true);return typeof texto==='string'&&ruta?(ruta.startsWith('/')?<Link key={tipo} className={'publico-cta '+tipo} to={ruta}>{texto}</Link>:<a key={tipo} className={'publico-cta '+tipo} href={ruta}>{texto}</a>):null})}</div>
  </div>{slides.length>1&&<div className="publico-carrusel-controles"><button aria-label="Anterior" onClick={()=>setIndice(i=>(i-1+slides.length)%slides.length)}><ChevronLeft size={20} /></button>{slides.map((s,i)=><button key={s.id} className={i===indice%slides.length?'activo':''} aria-label={'Mostrar banner '+(i+1)} aria-pressed={i===indice%slides.length} onClick={()=>setIndice(i)} />)}<button aria-label="Siguiente" onClick={()=>setIndice(i=>(i+1)%slides.length)}><ChevronRight size={20} /></button><button aria-label={pausa?'Continuar carrusel':'Pausar carrusel'} onClick={()=>setPausa(p=>!p)}>{pausa?<Play size={16} />:<Pause size={16} />}</button></div>}
 </section>
}
