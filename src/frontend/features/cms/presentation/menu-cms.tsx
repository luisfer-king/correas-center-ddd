import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { usarCargaCapacidadesCms } from './capacidades-cms'
import { gruposNavegacionCms } from './navegacion-cms'
import './cms.css'
export function MenuCms() {
 const {datos,error} = usarCargaCapacidadesCms(); const [abierto,setAbierto] = useState(false); const contenedor = useRef<HTMLDivElement>(null); const ubicacion = useLocation()
 useEffect(()=>setAbierto(false),[ubicacion.pathname,ubicacion.search])
 useEffect(()=>{ if(!abierto)return; const cerrar=(e:PointerEvent)=>{if(!contenedor.current?.contains(e.target as Node))setAbierto(false)};document.addEventListener('pointerdown',cerrar);return()=>document.removeEventListener('pointerdown',cerrar)},[abierto])
 if (!datos || !gruposNavegacionCms.some(g=>g.enlaces.some(e=>datos.recursos[e.recurso].leer))) return error && error !== 'Acceso denegado' ? <NavLink className="cms-menu-trigger" to="/portal/cms">CMS</NavLink> : null
 return <div ref={contenedor} className="cms-menu" onKeyDown={e=>{if(e.key==='Escape'){setAbierto(false);contenedor.current?.querySelector('button')?.focus()}}}><button className={`cms-menu-trigger ${ubicacion.pathname.startsWith('/portal/cms')?'cms-selected':''}`} aria-expanded={abierto} aria-controls="cms-menu-links" onClick={()=>setAbierto(a=>!a)}>CMS <span aria-hidden="true">▾</span></button>{abierto && <div id="cms-menu-links" className="cms-menu-links">{gruposNavegacionCms.filter(g=>g.enlaces.some(e=>datos.recursos[e.recurso].leer)).map(g=><div key={g.titulo}><strong>{g.titulo}</strong>{g.enlaces.filter(e=>datos.recursos[e.recurso].leer).map(e=><NavLink key={e.ruta} to={`/portal/cms/${e.ruta}`}>{e.titulo}</NavLink>)}</div>)}</div>}</div>
}
