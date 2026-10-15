import { AvisoActualizacionPublica } from './aviso-actualizacion-publica'
import { IntegracionesPublicas } from './integraciones-publicas'
import { MetadatosPublicos } from './metadatos-publicos'
import './cierre-publico.css'
import './captacion-publica.css'
import { esRutaSoluciones } from './soluciones-rutas'
import { invalidarCachePublica } from '../api/cache-publica'
import { esRutaCatalogo } from './datos-catalogo-publico'
import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { obtenerMarcoPublico, type DatosMarcoPublico } from '../api/cliente-marco-publico'
import { destinoPublico, normalizarRutaPublica, vistaParaNavigation } from './datos-marco-publico'
import { Navigation } from './navigation'
import { FooterPublico } from './footer-publico'
import { BreadcrumbsPublico } from './breadcrumbs-publico'
import { WhatsAppPublico } from './whatsapp-publico'
const ContenidoInicioPublico = lazy(() => import('./contenido-inicio-publico').then(m => ({default: m.ContenidoInicioPublico})))
import './publico.css'
import './marco-publico.css'
import './diseno-aprobado.css'
import './inicio-institucional.css'
import './diseno-entrega4.css'
import './entrega5.css'
const Soluciones = lazy(()=>import('./soluciones-publicas').then(m=>({default:m.SolucionesPublicas})))
const Contacto = lazy(()=>import('./contacto-publico').then(m=>({default:m.ContactoPublico})))
const Catalogo = lazy(()=>import('./catalogo-publico').then(m=>({default:m.CatalogoPublico})))
const Institucional = lazy(()=>import('./contenido-institucional').then(m=>({default:m.ContenidoInstitucional})))
export function VistaPublica() {
 const [datos, setDatos] = useState<DatosMarcoPublico | null>(null), [error, setError] = useState(''), [carga, setCarga] = useState(true), [revision, setRevision] = useState(0)
 const revisionVista = useRef(revision)
 const location = useLocation(), main = useRef<HTMLElement>(null), rutaAnterior = useRef(location.pathname)
 useEffect(() => {
  const controlador = new AbortController(); setCarga(true); setError(''); if(revisionVista.current!==revision){setDatos(null);revisionVista.current=revision}
  obtenerMarcoPublico(controlador.signal,location.pathname).then(d => { if (!controlador.signal.aborted) setDatos(d) }).catch(e => { if (!controlador.signal.aborted) { setDatos(null); setError(e instanceof Error ? e.message : 'No se pudo cargar el sitio.') } }).finally(() => { if (!controlador.signal.aborted) setCarga(false) })
  return () => controlador.abort()
 }, [revision,location.pathname === '/'])
 const ruta = normalizarRutaPublica(location.pathname), destino = datos ? destinoPublico(ruta, datos) : null
 useEffect(() => {
  if (!datos) return
  document.title = (ruta === '/' ? '' : (destino?.nombre || (esRutaCatalogo(ruta,datos.menus)?'Catálogo':esRutaSoluciones(ruta,datos.menus)?'Soluciones':'Página no encontrada')) + ' | ') + datos.empresa.nombre
  if (rutaAnterior.current !== location.pathname) { main.current?.focus(); window.scrollTo?.({ top: 0, behavior: 'instant' }); rutaAnterior.current = location.pathname }
 }, [location.pathname, datos, ruta, destino?.nombre])
 if (!datos) return <div className="publico"><main className="publico-estado">{carga ? <p role="status">Cargando Correas Center…</p> : <><h1>No se pudo cargar el sitio</h1><p role="alert">{error}</p><button onClick={() => setRevision(r => r + 1)}>Reintentar</button></>}</main></div>
 return <div className="publico"><MetadatosPublicos empresa={datos.empresa.nombre}/><IntegracionesPublicas configuracion={datos.configuracion}/><a className="publico-saltar" href="#contenido-publico">Saltar al contenido</a><Navigation vista={vistaParaNavigation(datos)} institucional />
 <AvisoActualizacionPublica actualizar={() => { invalidarCachePublica(); setRevision(r => r + 1) }}/><main id="contenido-publico" tabIndex={-1} ref={main}>
  {ruta !== '/' && !esRutaCatalogo(ruta,datos.menus) && !esRutaSoluciones(ruta,datos.menus) && <BreadcrumbsPublico nombre={destino?.nombre || 'Página no encontrada'} padre={destino?.padre} />}
  {ruta === '/' ? <Suspense fallback={<p role="status">Cargando inicio…</p>}><ContenidoInicioPublico datos={datos} /></Suspense> : ruta==='/contact'?<Suspense fallback={<p role="status">Cargando contacto…</p>}><Contacto datos={datos}/></Suspense> : ['/about','/privacy','/terms'].includes(ruta) ? <Suspense fallback={<p role="status">Cargando contenido…</p>}><Institucional key={ruta} ruta={ruta} empresa={datos.empresa.nombre} /></Suspense> : esRutaCatalogo(ruta,datos.menus) ? <Suspense fallback={<p role="status">Cargando catálogo…</p>}><Catalogo key={ruta} ruta={ruta} datos={datos} /></Suspense> : esRutaSoluciones(ruta,datos.menus) ? <Suspense fallback={<p role="status">Cargando soluciones…</p>}><Soluciones key={ruta} ruta={ruta} datos={datos}/></Suspense> : !destino ? <section className="publico-seccion publico-destino"><span className="publico-badge">404</span><h1>Página no encontrada</h1><p>El enlace no está disponible. Puedes volver al inicio o consultar nuestras soluciones.</p><Link className="publico-cta primary" to="/">Volver al inicio</Link></section> : <section className="publico-seccion publico-destino"><h1>{destino.nombre}</h1><p>Consulta a nuestro equipo para recibir información y asesoramiento.</p><div className="publico-acciones"><Link className="publico-cta primary" to={ruta === '/contact' ? '/' : '/contact'}>{ruta === '/contact' ? 'Volver al inicio' : 'Contactar con Correas Center'}</Link></div>
   {datos.menus.find(m=>normalizarRutaPublica(m.ruta)===ruta)?.items.length ? <ul>{datos.menus.find(m=>normalizarRutaPublica(m.ruta)===ruta)!.items.map(i=><li key={i.id}><Link to={i.ruta}>{i.nombre}</Link></li>)}</ul> : null}
  </section>}
 </main><FooterPublico datos={datos} actualizar={() => { invalidarCachePublica(); setRevision(r => r + 1) }} cargando={carga} /><WhatsAppPublico configuracion={datos.configuracion.whatsapp} /></div>
}
