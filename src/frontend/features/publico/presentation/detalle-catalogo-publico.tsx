import { GamaCategoriaPublica } from './gama-categoria-publica'
import { ConsultaCategoria } from './consulta-categoria'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import type { CategoriaPublica, DetalleProductoPublico, AtributoPublico } from '../../../../shared/publico/catalogo'
import type { DatosMarcoPublico } from '../api/cliente-marco-publico'
import { enlaceWhatsApp } from './datos-marco-publico'
import { rutaCategoria, rutaProducto, valorAtributo } from './datos-catalogo-publico'
import { CabeceraCatalogo, ImagenCatalogo, MarcasProducto } from './componentes-catalogo'
import { HtmlCms } from './html-cms'
import { IconoPublico } from './icono-publico'

function ConsultaCatalogo({nombre,datos}:{nombre:string;datos:DatosMarcoPublico}) {
 const enlace=enlaceWhatsApp({...datos.configuracion.whatsapp,mensaje:(datos.configuracion.whatsapp.mensaje+'\nConsulta sobre: '+nombre).trim()})
 return <aside className="catalogo-consulta"><h2>¿Necesitas cotización?</h2><p>Solicita información sobre {nombre}.</p>{enlace?<a href={enlace} target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faWhatsapp}/> Consultar por WhatsApp</a>:<Link to="/contact">Contactar con nuestro equipo</Link>}</aside>
}
export function ProductoCatalogo({producto:p,datos}:{producto:DetalleProductoPublico;datos:DatosMarcoPublico}) {
 const detalle=p.detalleCategoriasDisponible??datos.menus.some(m=>m.tipoRegistro==='producto'&&m.registroId===p.id&&m.cargarSubmenu)
 return <><CabeceraCatalogo titulo={p.nombre} imagen={p.imagen} descripcion={'Explora todas las categorías disponibles de '+p.nombre.toLocaleLowerCase('es')+'.'}/><section className="catalogo-contenido publico-inicio-contenedor"><Link className="catalogo-volver" to="/products">← Volver a todos los productos</Link>{p.marcas.length>0&&<section className="catalogo-panel-marcas"><h2>Marcas disponibles para este producto</h2><MarcasProducto marcas={p.marcas}/></section>}<h2>Todas las categorías</h2><div className="catalogo-grid catalogo-grid-tres">{p.categorias.map(c=><article className="catalogo-tarjeta" key={c.id}>{detalle?<Link to={rutaCategoria(p,c,datos.menus)}><ImagenCatalogo src={c.imagen} nombre={c.nombre}/></Link>:<ImagenCatalogo src={c.imagen} nombre={c.nombre}/>}<div className="catalogo-tarjeta-texto"><h3>{detalle?<Link to={rutaCategoria(p,c,datos.menus)}>{c.nombre}</Link>:c.nombre}</h3>{c.uso&&<span className="catalogo-etiqueta">{c.uso}</span>}{c.descripcionCorta&&<p>{c.descripcionCorta}</p>}{!detalle&&c.descripcion&&<details><summary>Descripción completa</summary><HtmlCms html={c.descripcion}/></details>}{detalle?<Link className="catalogo-detalles" to={rutaCategoria(p,c,datos.menus)}>Ver características →</Link>:<ConsultaCategoria producto={p.nombre} categoria={c.nombre} configuracion={datos.configuracion.whatsapp}/>}</div></article>)}</div>{!p.categorias.length&&<p>No hay categorías publicadas para este producto.</p>}<ConsultaCatalogo nombre={p.nombre} datos={datos}/></section></>
}
export function AtributosCategoria({atributos}:{atributos:AtributoPublico[]}) {
 const [tab,setTab]=useState('')
 const grupos=[...new Map(atributos.map(a=>[a.tipo.slug,a.tipo])).values()], activo=grupos.some(g=>g.slug===tab)?tab:grupos[0]?.slug
 if(!grupos.length)return <p>No hay características publicadas para esta categoría.</p>
 return <><div className="catalogo-tabs" role="tablist" aria-label="Tipos de características">{grupos.map((g,i)=><button key={g.slug} role="tab" id={'atributo-tab-'+i} aria-controls={'atributo-panel-'+i} aria-selected={activo===g.slug} tabIndex={activo===g.slug?0:-1} onClick={()=>setTab(g.slug)} onKeyDown={e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();const n=e.key==='Home'?0:e.key==='End'?grupos.length-1:(i+(e.key==='ArrowRight'?1:-1)+grupos.length)%grupos.length;setTab(grupos[n].slug);(e.currentTarget.parentElement?.children[n] as HTMLElement)?.focus()}}}><IconoPublico nombre={g.icono}/>{g.nombre}<span>{atributos.filter(a=>a.tipo.slug===g.slug).length}</span></button>)}</div>{grupos.filter(g=>g.slug===activo).map(g=>{const i=grupos.indexOf(g);return <section role="tabpanel" tabIndex={0} key={g.slug} id={'atributo-panel-'+i} aria-labelledby={'atributo-tab-'+i} className="catalogo-atributos">{atributos.filter(a=>a.tipo.slug===g.slug).map(a=><article key={a.id}><div><h3>{a.nombre}</h3><strong>{valorAtributo(a)}</strong></div>{a.descripcion&&<p>{a.descripcion}</p>}</article>)}</section>})}</>
}
export function CategoriaCatalogo({categoria:c,datos}:{categoria:CategoriaPublica;datos:DatosMarcoPublico}) {
 return <><CabeceraCatalogo titulo={c.nombre} descripcion={c.descripcionCorta} imagen={c.imagen}/><section className="catalogo-contenido publico-inicio-contenedor"><Link className="catalogo-volver" to={rutaProducto(c.producto,datos.menus)}>← Volver a {c.producto.nombre}</Link><div className="catalogo-detalle-grid"><div>{c.uso&&<span className="catalogo-etiqueta">{c.uso}</span>}{c.descripcion&&<section className="catalogo-descripcion"><h2>Descripción general</h2><HtmlCms html={c.descripcion}/></section>}<h2>Características generales</h2><AtributosCategoria atributos={c.atributos}/></div><div><ImagenCatalogo src={c.imagen} nombre={c.nombre} prioritaria/><ConsultaCatalogo nombre={c.nombre} datos={datos}/><Link className="catalogo-volver" to="/products">Ver todos los productos →</Link></div></div></section><section className="catalogo-gama-ancha"><GamaCategoriaPublica categoriaId={c.id}/></section></>
}
