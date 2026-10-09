import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import type { VistaPublica as DatosVista } from '../../../../shared/vista-publica'
import { rutaPublica } from '../../../../shared/vista-publica'
import { obtenerVistaPublica } from '../api/cliente-vista-publica'
import { Navigation } from './navigation'
import './publico.css'
import { imagenPublica } from './imagen-publica'
export function VistaPublica() {
 const [vista, setVista] = useState<DatosVista | null>(null), [error, setError] = useState(''), [carga, setCarga] = useState(true), [revision, setRevision] = useState(0)
 const location = useLocation()
 useEffect(() => {
  const controlador = new AbortController(); setCarga(true); setError('')
  obtenerVistaPublica(controlador.signal).then(setVista).catch(e => { if (!controlador.signal.aborted) setError(e instanceof Error ? e.message : 'No se pudo cargar la vista.') }).finally(() => { if (!controlador.signal.aborted) setCarga(false) })
  return () => controlador.abort()
 }, [revision])
 if (!vista) return <div className="publico"><main className="publico-estado">{carga ? <p role="status">Cargando Correas Center…</p> : <><p role="alert">{error}</p><button onClick={() => setRevision(r => r + 1)}>Reintentar</button></>}</main></div>
 const menus = Object.values(vista.menus).flat(), rutaActual = location.pathname.replace(/\/$/, '') || '/'
 const menu = menus.find(m => m.ruta.replace(/\/$/, '') === rutaActual), hijo = menus.flatMap(m => m.items).find(i => i.ruta.replace(/\/$/, '') === rutaActual)
 return <div className="publico"><Navigation vista={vista} /><main>
  {error && <p className="publico-aviso" role="alert">{error}</p>}
  {rutaActual === '/' ? <>
   {vista.secciones.length ? vista.secciones.map((s, indice) => <section className={indice === 0 ? 'publico-seccion publico-hero' : 'publico-seccion'} key={s.id}>
    <div className="publico-contenido"><div>
     {typeof s.metadata.badge_text === 'string' && <span className="publico-badge">{s.metadata.badge_text}</span>}
     {s.titulo && (indice === 0 ? <h1>{s.titulo}</h1> : <h2>{s.titulo}</h2>)}
     {s.subtitulo && <p className="publico-subtitulo">{s.subtitulo}</p>}
     {s.descripcion && <p className="publico-descripcion">{s.descripcion}</p>}
     <div className="publico-acciones">{['primary', 'secondary'].map(tipo => {
      const texto = s.metadata['cta_' + tipo + '_text'], href = rutaPublica(s.metadata['cta_' + tipo + '_href'])
      return typeof texto === 'string' && href ? <Link key={tipo} className={'publico-cta ' + tipo} to={href}>{texto}</Link> : null
     })}</div>
    </div>{imagenPublica(s.imagen) && <img src={imagenPublica(s.imagen)} alt="" loading={indice === 0 ? 'eager' : 'lazy'} />}</div>
   </section>) : <section className="publico-seccion publico-hero"><h1>{vista.empresa.nombre}</h1><p>Explora nuestras soluciones industriales.</p></section>}
   <section className="publico-seccion"><h2>Soluciones para tu industria</h2><div className="publico-tarjetas">{menus.map(m => <Link key={m.id} to={m.ruta}><h3>{m.nombre}</h3><span>Ver soluciones →</span></Link>)}</div></section>
  </> : <section className="publico-seccion publico-destino"><Link to="/">← Volver al inicio</Link><h1>{hijo?.nombre ?? menu?.nombre ?? 'Contenido en preparación'}</h1><p>Este destino permite comprobar los enlaces del menú. La página detallada se desarrollará en la siguiente fase.</p>{menu?.items.length ? <ul>{menu.items.map(i => <li key={i.id}><Link to={i.ruta}>{i.nombre}</Link></li>)}</ul> : null}</section>}
 </main><footer className="publico-footer"><span>{vista.empresa.nombre}</span><button disabled={carga} onClick={() => setRevision(r => r + 1)}>{carga ? 'Actualizando…' : 'Actualizar contenido'}</button></footer></div>
}
