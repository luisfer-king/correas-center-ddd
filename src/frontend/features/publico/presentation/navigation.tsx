import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import type { GrupoPublico, VistaPublica } from '../../../../shared/vista-publica'
import { imagenPublica } from './imagen-publica'
import { IconoPublico } from './icono-publico'
const grupos: { grupo: GrupoPublico; nombre: string }[] = [{ grupo: 'Producto', nombre: 'Productos' }, { grupo: 'Aplicacion', nombre: 'Aplicaciones' }, { grupo: 'Servicio', nombre: 'Servicios' }]
export function Navigation({ vista }: { vista: VistaPublica }) {
 const [abierto, setAbierto] = useState(false), [grupoAbierto, setGrupoAbierto] = useState<GrupoPublico | null>(null)
 const location = useLocation()
 useEffect(() => { setAbierto(false); setGrupoAbierto(null) }, [location.pathname])
 return <header className="publico-header" onKeyDown={e => { if (e.key === 'Escape') { setAbierto(false); setGrupoAbierto(null) } }}>
  <div className="publico-barra"><Link className="publico-logo" to="/">{imagenPublica(vista.empresa.logo) ? <img src={imagenPublica(vista.empresa.logo)} alt={vista.empresa.nombre} /> : vista.empresa.nombre}<small>Solución confiable</small></Link>
  <button className="publico-mobile" aria-expanded={abierto} aria-controls="navegacion-publica" onClick={() => setAbierto(!abierto)}>{abierto ? 'Cerrar' : 'Menú'}</button>
  <nav id="navegacion-publica" aria-label="Navegación principal" className={abierto ? 'publico-nav abierto' : 'publico-nav'}>
   <Link to="/">Inicio</Link>
   {grupos.map(({ grupo, nombre }) => vista.menus[grupo].length ? <div className="publico-grupo" key={grupo} onMouseEnter={() => setGrupoAbierto(grupo)} onMouseLeave={() => setGrupoAbierto(null)} onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) setGrupoAbierto(null) }}>
    <button aria-expanded={grupoAbierto === grupo} aria-controls={'grupo-' + grupo} onClick={() => setGrupoAbierto(grupoAbierto === grupo ? null : grupo)}>{nombre} <span aria-hidden="true">⌄</span></button>
    <div className="publico-desplegable" id={'grupo-' + grupo} hidden={grupoAbierto !== grupo}>
     {vista.menus[grupo].map(menu => <div className="publico-categoria" key={menu.id}>
      <Link className="publico-padre" to={menu.ruta}><IconoPublico nombre={menu.icono} />{menu.nombre}</Link>
      {menu.items.length > 0 && <ul>{menu.items.map(item => <li key={item.id}><Link to={item.ruta}>{item.nombre}</Link></li>)}</ul>}
     </div>)}
    </div>
   </div> : null)}
  </nav></div>
 </header>
}
