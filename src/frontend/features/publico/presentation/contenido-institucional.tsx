import { useState } from 'react'
import { registrosInstitucionales } from '../api/cliente-contenido-publico'
import { useRecursoPublico } from './use-recurso-publico'
import { HtmlCms } from './html-cms'
import { IconoPublico } from './icono-publico'
import type { RegistroPublicado } from '../../../../shared/publico/cms'
import { contenidoLegalInicial as contenidoInicial } from '../../../../shared/publico/contenido-legal-inicial'
const identificadoresLegal = { '/privacy':['privacidad','privacy','politica-privacidad','politicas-privacidad'], '/terms':['terminos-condiciones','terminos','terms','terminos-y-condiciones'] } as const
export function ContenidoInstitucional({ruta,empresa}:{ruta:string;empresa:string}) {
 const {datos,cargando,error,elemento,reintentar}=useRecursoPublico(registrosInstitucionales,[] as RegistroPublicado[])
 const [tab,setTab]=useState('')
 const registro=(id:string)=>datos.find(r=>r.identificador===id)
 const legal=ruta==='/privacy'||ruta==='/terms',ids=legal?identificadoresLegal[ruta]:[]
 const documento=datos.find(r=>ids.some(id=>id===r.identificador)), inicial=contenidoInicial[ruta==='/privacy'?'privacidad':'terminos-condiciones']
 const grupos=[{id:'estadisticas',nombre:'Estadísticas'},{id:'filosofia',nombre:'Filosofía'},{id:'timeline',nombre:'Historia'},{id:'porque_elegirnos',nombre:'¿Por qué elegirnos?'}].filter(g=>registro(g.id))
 const activo=grupos.some(g=>g.id===tab)?tab:grupos[0]?.id
 const cabecera=registro('header'),introduccion=registro('introduccion')
 return <div ref={elemento as React.RefObject<HTMLDivElement>}>
  <section className="publico-institucional-hero"><div className="publico-inicio-contenedor"><span>{legal?'Información':'Sobre Nosotros'}</span><h1>{legal?(documento?.nombre||inicial.nombre):empresa}</h1>{!legal&&<HtmlCms html={cabecera?.descripcion||null} />}</div></section>
  <section className="publico-institucional-contenido publico-inicio-contenedor">
   {cargando&&<p role="status">Cargando contenido…</p>}{error&&<div role="alert"><p>No se pudo consultar el contenido publicado.</p><button onClick={reintentar}>Reintentar</button></div>}
   {!cargando&&!error&&(legal?<>{documento?<><HtmlCms html={documento.descripcion} />{documento.contenidos.map(c=><article key={c.id}>{c.titulo&&<h2>{c.titulo}</h2>}{c.subtitulo&&<p>{c.subtitulo}</p>}<HtmlCms html={c.descripcion} /></article>)}</>:<HtmlCms html={inicial.html} />}</>:<>
    {introduccion&&<article><h2>{introduccion.nombre}</h2><HtmlCms html={introduccion.descripcion} />{introduccion.contenidos.map(c=><div key={c.id}>{c.titulo&&<h3>{c.titulo}</h3>}{c.subtitulo&&<p>{c.subtitulo}</p>}<HtmlCms html={c.descripcion} /></div>)}</article>}
    {grupos.length>0&&<><div className="publico-institucional-tabs" role="tablist" aria-label="Conoce Correas Center">{grupos.map((g,i)=><button key={g.id} id={'tab-'+g.id} role="tab" aria-selected={activo===g.id} aria-controls={'panel-'+g.id} tabIndex={activo===g.id?0:-1} onClick={()=>setTab(g.id)} onKeyDown={e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();const n=e.key==='Home'?0:e.key==='End'?grupos.length-1:(i+(e.key==='ArrowRight'?1:-1)+grupos.length)%grupos.length;setTab(grupos[n].id);(e.currentTarget.parentElement?.children[n] as HTMLElement)?.focus()}}}>{g.nombre}</button>)}</div>
     {grupos.filter(g=>g.id===activo).map(g=>{const r=registro(g.id)!;return <section key={g.id} role="tabpanel" id={'panel-'+g.id} aria-labelledby={'tab-'+g.id} className={"publico-institucional-panel publico-panel-"+g.id}><h2>{r.nombre}</h2><HtmlCms html={r.descripcion} /><div className="publico-grid-inicio">{r.contenidos.map(c=><article className="publico-tarjeta-cms" key={c.id}><IconoPublico nombre={c.icono} />{c.titulo&&<h3>{c.titulo}</h3>}{c.subtitulo&&<p className="publico-cms-destacado">{c.subtitulo}</p>}<HtmlCms html={c.descripcion} /></article>)}</div></section>})}</>}
    {!datos.length&&<p>No hay contenido institucional publicado.</p>}
   </>)}
  </section>
 </div>
}
