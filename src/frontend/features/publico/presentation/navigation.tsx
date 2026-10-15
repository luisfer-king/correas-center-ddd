import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronDown, Menu, Search, X } from 'lucide-react'
import type { GrupoPublico, VistaPublica } from '../../../../shared/vista-publica'
import { imagenPublica } from './imagen-publica'
import { IconoPublico } from './icono-publico'
const grupos: { grupo: GrupoPublico; nombre: string }[] = [{ grupo: 'Producto', nombre: 'Productos' }, { grupo: 'Aplicacion', nombre: 'Industrias' }, { grupo: 'Servicio', nombre: 'Servicios' }]
export function Navigation({ vista, institucional = false }: { vista: VistaPublica; institucional?: boolean }) {
 const [abierto, setAbierto] = useState(false), [grupo, setGrupo] = useState<GrupoPublico | null>(null), [producto, setProducto] = useState<string | null>(null)
 const cabecera = useRef<HTMLElement>(null), boton = useRef<HTMLButtonElement | null>(null), grupoFijado = useRef<GrupoPublico | null>(null), productoFijado = useRef<string | null>(null)
 const salida = useRef<ReturnType<typeof setTimeout> | null>(null), salidaProducto = useRef<ReturnType<typeof setTimeout> | null>(null)
 const location = useLocation()
 function cancelarSalida() { if (salida.current) clearTimeout(salida.current); salida.current = null }
 function cancelarProducto() { if (salidaProducto.current) clearTimeout(salidaProducto.current); salidaProducto.current = null }
 function cerrar() { cancelarSalida(); cancelarProducto(); setAbierto(false); setGrupo(null); setProducto(null); grupoFijado.current = null; productoFijado.current = null }
 function abrirGrupo(g: GrupoPublico) { cancelarSalida(); if (grupo !== g) { setProducto(null); productoFijado.current = null } setGrupo(g) }
 function clickGrupo(g: GrupoPublico, control: HTMLButtonElement) {
  boton.current = control; cancelarSalida()
  if (grupo === g && grupoFijado.current === g) { setGrupo(null); setProducto(null); grupoFijado.current = null }
  else { abrirGrupo(g); grupoFijado.current = g }
 }
 function abrirProducto(id: string) { cancelarProducto(); setProducto(id) }
 function clickProducto(id: string, control: HTMLButtonElement) {
  boton.current = control; cancelarProducto()
  if (producto === id && productoFijado.current === id) { setProducto(null); productoFijado.current = null }
  else { setProducto(id); productoFijado.current = id }
 }
 useEffect(() => { cerrar() }, [location.pathname, location.search, location.hash]) // cerrar también enlaces a la misma página
 useEffect(() => {
  const fuera = (e: PointerEvent) => { if (!cabecera.current?.contains(e.target as Node)) cerrar() }
  document.addEventListener('pointerdown', fuera)
  return () => { document.removeEventListener('pointerdown', fuera); cancelarSalida(); cancelarProducto() }
 }, [])
 return <header ref={cabecera} className="publico-header" translate="no" onMouseEnter={cancelarSalida} onMouseLeave={e => {
  if (!(e.relatedTarget instanceof window.Node) || !cabecera.current?.contains(e.relatedTarget)) { cancelarSalida(); salida.current = setTimeout(cerrar, 220) }
 }} onClick={e => { if ((e.target as Element).closest('a')) cerrar() }} onKeyDown={e => {
  if (e.key === 'Escape') { e.stopPropagation(); cerrar(); boton.current?.focus() }
 }} onBlur={e => { if (e.relatedTarget && !e.currentTarget.contains(e.relatedTarget)) cerrar() }}>
  <div className="publico-barra"><Link className="publico-logo" to="/" aria-label="Ir al inicio">
   {imagenPublica(vista.empresa.logo) && <img src={imagenPublica(vista.empresa.logo)} alt="" />}<div className="publico-identidad"><span>{vista.empresa.nombre}</span><small>Solución Confiable</small></div>
  </Link>
  <button className="publico-mobile" aria-label={abierto ? 'Cerrar menú' : 'Menú'} aria-expanded={abierto} aria-controls="navegacion-publica" onClick={e => { boton.current = e.currentTarget; setAbierto(!abierto) }}>{abierto ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}</button>
  <nav id="navegacion-publica" aria-label="Navegación principal" className={abierto ? 'publico-nav abierto' : 'publico-nav'}>
   <Link to="/"><span>Inicio</span></Link>
   {grupos.map(({ grupo: g, nombre }) => vista.menus[g].length ? <div className="publico-grupo" key={g} onMouseEnter={() => abrirGrupo(g)}>
    <button aria-expanded={grupo === g} aria-controls={'grupo-' + g} onClick={e => clickGrupo(g, e.currentTarget)}><span>{nombre}</span><ChevronDown size={18} className={grupo === g ? 'publico-chevron girado' : 'publico-chevron'} aria-hidden="true" /></button>
    <div className="publico-desplegable" id={'grupo-' + g} hidden={grupo !== g}>
     {vista.menus[g].map(m => <div className="publico-categoria" key={m.id} onMouseEnter={() => { if (m.items.length) abrirProducto(m.id) }} onMouseLeave={() => {
      cancelarProducto(); salidaProducto.current = setTimeout(() => { setProducto(actual => actual === m.id ? null : actual); if (productoFijado.current === m.id) productoFijado.current = null }, 220)
     }}>
      <div className="publico-producto-cabecera"><Link className="publico-padre" to={m.ruta}><IconoPublico nombre={m.icono}/><span>{m.nombre}</span></Link>{m.items.length>0&&<button className="publico-producto-control" aria-label={'Mostrar categorías de '+m.nombre} aria-expanded={producto===m.id} aria-controls={'categorias-'+m.id} onClick={e=>clickProducto(m.id,e.currentTarget)}><ChevronDown size={18} className={producto===m.id?'publico-chevron girado':'publico-chevron'} aria-hidden="true"/></button>}</div>
      {m.items.length > 0 && <div className="publico-subcategorias" id={'categorias-' + m.id} hidden={producto !== m.id}><ul>{m.items.slice(0, 3).map(i => <li key={i.id}><Link to={m.cargarSubmenu===false?m.ruta:i.ruta}><span>{i.nombre}</span></Link></li>)}</ul><Link className="publico-ver-mas" to={m.ruta} aria-label={(m.items.length > 3 ? 'Ver más categorías de ' : 'Ver producto ') + m.nombre}><span>{m.items.length > 3 ? 'Ver más' : 'Ver producto'}</span><span aria-hidden="true">→</span></Link></div>}
     </div>)}
    </div>
   </div> : null)}
   {institucional && <><Link to="/about"><span>Nosotros</span></Link><Link to="/branches"><span>Sucursales</span></Link><Link to="/contact"><span>Contacto</span></Link><Link to="/search" aria-label="Buscar en el catálogo"><Search size={18}/><span className="publico-buscar-texto">Buscar</span></Link></>}
  </nav></div>
 </header>
}
