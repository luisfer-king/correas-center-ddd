import { lazy,Suspense } from 'react'
const Asistente=lazy(()=>import('./asistente-publico').then(m=>({default:m.AsistentePublico})))
import { Link } from 'react-router-dom'
import type { DatosMarcoPublico } from '../api/cliente-marco-publico'
import { productosInicio, industriasInicio, serviciosInicio } from '../api/cliente-contenido-publico'
import { MarcasInicio } from './marcas-inicio'
import { HeroPublico } from './hero-publico'
import { BloqueCatalogoInicio } from './bloque-catalogo-inicio'
import { BloqueCmsInicio } from './bloque-cms-inicio'
import { SucursalesInicio } from './sucursales-inicio'
export function ContenidoInicioPublico({datos}:{datos:DatosMarcoPublico}) {
 const delTipo=(...tipos:string[])=>datos.secciones.filter(s=>tipos.includes(s.tipo.toLowerCase()))
 const reconocidos=new Set(['hero','diferencial','diferenciales','por-que-elegirnos','caracteristica-de-infraestructura','capacidad-de-infraestructura'])
 return <><HeroPublico slides={delTipo('hero')} empresa={datos.empresa.nombre} />
  <Suspense fallback={null}><Asistente datos={datos}/></Suspense>
  <BloqueCatalogoInicio titulo="Nuestros Productos" subtitulo="Soluciones industriales" tipo="producto" lista="/products" leer={productosInicio} datos={datos} />
  <MarcasInicio modoInicial={datos.configuracion.marcas?.presentacion ?? 'carrusel'} />
  <BloqueCatalogoInicio titulo="Nuestros Servicios" subtitulo="Asesoramiento especializado" tipo="servicio" lista="/services" leer={serviciosInicio} datos={datos} />
  <BloqueCatalogoInicio titulo="Industrias que atendemos" subtitulo="Experiencia en tu sector" tipo="industria" lista="/applications" leer={industriasInicio} datos={datos} />
  <BloqueCmsInicio titulo="Nuestra Infraestructura" subtitulo="Capacidad para responder" items={delTipo('caracteristica-de-infraestructura','capacidad-de-infraestructura')} />
  <BloqueCmsInicio titulo="Lo que nos diferencia" subtitulo="Compromiso con tu empresa" items={delTipo('diferencial','diferenciales','por-que-elegirnos')} />
  {datos.secciones.filter(s=>!reconocidos.has(s.tipo.toLowerCase())).map(s=><BloqueCmsInicio key={s.id} titulo={s.titulo||datos.empresa.nombre} subtitulo={s.subtitulo||''} items={[s]} />)}
  <SucursalesInicio /><section className="publico-bloque-inicio publico-contacto-inicio"><div className="publico-inicio-contenedor"><h2>Hablemos de lo que tu empresa necesita</h2><p>Consulta sobre nuestros productos y servicios. Nuestro equipo está listo para asesorarte.</p><Link className="publico-cta primary" to="/contact">Contactar con Correas Center</Link></div></section>
 </>
}
