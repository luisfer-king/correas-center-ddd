import type { SeccionPublicada } from '../../../../shared/publico/cms'
import { IconoPublico } from './icono-publico'
import { HtmlCms } from './html-cms'
import { imagenPublica } from './imagen-publica'
export function BloqueCmsContenido({titulo,subtitulo,items,oscuro=false}:{titulo:string;subtitulo:string;items:SeccionPublicada[];oscuro?:boolean}) {
 if(!items.length)return null
 const capacidades=items.filter(s=>s.tipo==='capacidad-de-infraestructura'), normales=items.filter(s=>s.tipo!=='capacidad-de-infraestructura')
 const tarjeta=(s:SeccionPublicada)=>{
  const diferencial=s.tipo.includes('diferencial')||s.tipo==='por-que-elegirnos'
  const textos=<>{s.titulo&&<h3>{s.titulo}</h3>}{s.subtitulo&&<p className="publico-cms-destacado">{s.subtitulo}</p>}</>
  return <article className={'publico-tarjeta-cms '+(diferencial?'publico-tarjeta-diferencial':'')} key={s.id}>
   {imagenPublica(s.imagen)&&<img src={imagenPublica(s.imagen)} alt="" width={400} height={240} loading="lazy" decoding="async"/>}
   {diferencial?<div className="publico-cms-cabecera"><IconoPublico nombre={s.icono}/><div>{textos}</div></div>:<><IconoPublico nombre={s.icono}/>{textos}</>}
   <HtmlCms html={s.descripcion}/>{(typeof s.metadata.stats==='string'||typeof s.metadata.stats==='number')&&<strong className="publico-cms-destacado">{String(s.metadata.stats)}</strong>}
  </article>
 }
 return <section className={'publico-bloque-inicio '+(oscuro?'publico-bloque-oscuro':'')}><div className="publico-inicio-contenedor"><div className="publico-titulo-inicio"><span>{subtitulo}</span><h2>{titulo}</h2></div><div className={'publico-grid-inicio '+(normales.some(s=>s.tipo.includes('diferencial')||s.tipo==='por-que-elegirnos')?'publico-grid-tres':'')}>{normales.map(tarjeta)}</div>{capacidades.length>0&&<section className="publico-capacidades"><h3>Nuestras capacidades</h3><div>{capacidades.map(tarjeta)}</div></section>}</div></section>
}
