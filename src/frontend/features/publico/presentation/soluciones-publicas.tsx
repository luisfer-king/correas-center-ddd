import { ArrowRight, Wrench } from 'lucide-react'
import { CabeceraSoluciones, ImagenSolucion, TarjetaSolucion as Tarjeta, TituloSoluciones, VacioSoluciones } from './componentes-soluciones'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { IndustriaPublica, ServicioPublico, DetalleIndustriaPublica, DetalleServicioPublico } from '../../../../shared/publico/catalogo'
import type { DatosMarcoPublico } from '../api/cliente-marco-publico'
import { industriasPublicas, serviciosPublicos, industriaPublica, servicioPublico } from '../api/cliente-soluciones-publicas'
import { SinResultado } from './componentes-catalogo'
import { BreadcrumbsPublico } from './breadcrumbs-publico'
import { HtmlCms } from './html-cms'
import { IconoRedSocial } from './icono-red-social'
import { enlaceWhatsApp, normalizarRutaPublica } from './datos-marco-publico'
import './catalogo-publico.css'
import './soluciones-publicas.css'


type Contenido = {lista:(IndustriaPublica|ServicioPublico)[]} | {industria:DetalleIndustriaPublica} | {servicio:DetalleServicioPublico}
export function SolucionesPublicas({ruta,datos}:{ruta:string;datos:DatosMarcoPublico}) {
 const menu=datos.menus.find(m=>['industria','servicio'].includes(m.tipoRegistro)&&normalizarRutaPublica(m.ruta)===ruta)
 const tipo=menu?.tipoRegistro==='industria'||ruta.startsWith('/applications')?'industria':'servicio', base=tipo==='industria'?'/applications':'/services', titulo=tipo==='industria'?'Aplicaciones e Industrias':'Servicios'
 const listado=ruta===base, [contenido,setContenido]=useState<Contenido|null>(null),[error,setError]=useState(''),[ausente,setAusente]=useState(false),[revision,setRevision]=useState(0)
 useEffect(()=>{ const c=new AbortController();setContenido(null);setError('');setAusente(false)
  async function cargar():Promise<Contenido|null>{
   if(listado)return {lista:await(tipo==='industria'?industriasPublicas(c.signal):serviciosPublicos(c.signal))}
   let slug:string
   if(menu){const items=await(tipo==='industria'?industriasPublicas(c.signal):serviciosPublicos(c.signal));const item=items.find(i=>i.id===menu.registroId);if(!item)return null;slug=item.slug}
   else {try{slug=decodeURIComponent(ruta.slice(base.length+1))}catch{return null}if(!slug||/[\/\\\s]/.test(slug))return null}
   return tipo==='industria'?{industria:await industriaPublica(slug,c.signal)}:{servicio:await servicioPublico(slug,c.signal)}
  }
  cargar().then(d=>{if(!c.signal.aborted){setContenido(d);setAusente(!d)}}).catch(e=>{if(!c.signal.aborted){if(e?.estado===404)setAusente(true);else setError(e instanceof Error?e.message:'No se pudo cargar el contenido')}})
  return()=>c.abort()
 },[ruta,menu,tipo,base,listado,revision])
 const nombre=contenido&&'industria'in contenido?contenido.industria.nombre:contenido&&'servicio'in contenido?contenido.servicio.nombre:titulo
 useEffect(()=>{document.title=(ausente?'Recurso no disponible':nombre)+' | '+datos.empresa.nombre},[nombre,ausente,datos.empresa.nombre])
 const whatsapp=contenido&&'servicio'in contenido?enlaceWhatsApp({...datos.configuracion.whatsapp,mensaje:'Buenas, me interesa conocer más información sobre el servicio '+contenido.servicio.nombre}):null
 const contactoWhatsapp=enlaceWhatsApp({...datos.configuracion.whatsapp,mensaje:'Buenas, necesito información sobre soluciones para mi industria.'})
 return <div className="soluciones-publicas">
  <BreadcrumbsPublico nombre={nombre} padre={listado?undefined:{nombre:titulo,ruta:base}}/>
  {error?<section role="alert" className="catalogo-estado"><p>{error}</p><button onClick={()=>setRevision(r=>r+1)}>Reintentar</button></section>:ausente?<SinResultado titulo="Recurso no disponible"/>:!contenido?<p role="status" className="catalogo-estado">Cargando {titulo.toLowerCase()}…</p>:<>
   <CabeceraSoluciones nombre={nombre} tipo={tipo} listado={listado} imagen={'industria'in contenido?contenido.industria.imagen:'servicio'in contenido?contenido.servicio.imagen:null}/>
   {'lista'in contenido?<>
    <section className="soluciones-seccion publico-inicio-contenedor">
     <div className="soluciones-grid">{contenido.lista.map(i=><Tarjeta key={i.id} item={i} tipo={tipo}/>)}</div>
     {!contenido.lista.length&&<VacioSoluciones>No hay {tipo==='industria'?'industrias':'servicios'} publicados.</VacioSoluciones>}
    </section>
    {tipo==='industria'&&<section className="soluciones-cta"><div className="publico-inicio-contenedor"><h2>¿Tu sector no está en la lista?</h2><p>Cuéntanos qué necesitas y nuestro equipo te ayudará a encontrar una solución.</p><div><Link to="/contact" className="soluciones-boton">Contactar ahora <ArrowRight size={18}/></Link>{contactoWhatsapp&&<a href={contactoWhatsapp} className="soluciones-boton soluciones-boton-whatsapp" target="_blank" rel="noopener noreferrer"><IconoRedSocial nombre="faWhatsapp"/>Escribir por WhatsApp</a>}</div></div></section>}
   </>:'industria'in contenido?<>
    <section className="soluciones-seccion publico-inicio-contenedor">
     <TituloSoluciones tipo="categoria" titulo="Productos recomendados" descripcion="Categorías de productos para esta industria" cantidad={contenido.industria.categorias.length}/>
     <div className="soluciones-grid">{contenido.industria.categorias.map(c=><Link key={c.id} to={'/products/'+encodeURIComponent(c.producto.slug)} className="catalogo-tarjeta soluciones-tarjeta soluciones-categoria"><div className="soluciones-tarjeta-contenido"><span className="soluciones-producto">{c.producto.nombre}</span><h3>{c.nombre}</h3><div className="soluciones-resumen"><HtmlCms html={c.descripcionCorta}/></div><span className="soluciones-enlace">Ver producto <ArrowRight size={18}/></span></div></Link>)}</div>
     {!contenido.industria.categorias.length&&<VacioSoluciones>No hay categorías publicadas para este sector.</VacioSoluciones>}
    </section>
    <section className="soluciones-servicios"><div className="publico-inicio-contenedor soluciones-seccion">
     <TituloSoluciones tipo="servicio" titulo="Servicios disponibles" descripcion="Soporte técnico para tu operación" cantidad={contenido.industria.servicios.length}/>
     <div className="soluciones-grid">{contenido.industria.servicios.map(s=><Tarjeta key={s.id} item={s} tipo="servicio"/>)}</div>
     {!contenido.industria.servicios.length&&<VacioSoluciones>No hay servicios publicados para este sector.</VacioSoluciones>}
    </div></section>
   </>:<>
    <section className="soluciones-seccion publico-inicio-contenedor soluciones-detalle"><div className="soluciones-servicio-principal">
     <ImagenSolucion src={contenido.servicio.imagen} nombre={nombre} tipo="servicio" prioritaria/>
     <div className="soluciones-descripcion"><TituloSoluciones tipo="servicio" titulo="Sobre este servicio" descripcion="Información del servicio"/><HtmlCms html={contenido.servicio.descripcion}/>{!contenido.servicio.descripcion&&<p>Consulta con nuestro equipo para conocer los detalles de este servicio.</p>}</div>
    </div><aside className="soluciones-contacto"><span className="soluciones-contacto-icono"><Wrench size={28}/></span><h2>¿Necesitas este servicio?</h2><p>Cuéntanos qué necesitas y recibe información de nuestro equipo.</p>{whatsapp&&<a className="soluciones-boton" href={whatsapp} target="_blank" rel="noopener noreferrer"><IconoRedSocial nombre="faWhatsapp"/>Consultar por WhatsApp</a>}<Link className="soluciones-boton soluciones-boton-borde" to="/contact">Contactar <ArrowRight size={18}/></Link><Link className="soluciones-volver" to="/services">Ver todos los servicios</Link></aside></section>
    {!!contenido.servicio.industrias.length&&<section className="soluciones-servicios"><div className="soluciones-seccion publico-inicio-contenedor"><TituloSoluciones tipo="industria" titulo="Industrias relacionadas" descripcion="Sectores donde se aplica este servicio"/><div className="soluciones-grid">{contenido.servicio.industrias.map(i=><Tarjeta key={i.id} item={i} tipo="industria"/>)}</div></div></section>}
   </>}
  </>}
 </div>
}
