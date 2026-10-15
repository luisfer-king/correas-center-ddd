import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Clock, Phone } from 'lucide-react'
import { sucursalesPublicas } from '../api/cliente-contenido-publico'
import { useRecursoPublico } from './use-recurso-publico'
import { mapaSucursal } from './mapa-sucursal'
import type { SucursalPublica } from '../../../../shared/publico/comun'
export function SucursalesInicio() {
 const {datos,error,cargando,elemento,reintentar}=useRecursoPublico(sucursalesPublicas,[] as SucursalPublica[]),[seleccion,setSeleccion]=useState('')
 const activa=datos.find(s=>s.id===seleccion)??datos.find(s=>s.esPrincipal)??datos[0],mapa=mapaSucursal(activa?.mapaIncrustado??null)
 return <section className="publico-bloque-inicio publico-bloque-sucursales" ref={elemento}><div className="publico-inicio-contenedor"><div className="publico-titulo-inicio"><span>Cerca de ti</span><h2>Nuestras Sucursales</h2></div>{cargando&&!datos.length&&<p role="status">Cargando sucursales…</p>}{error&&<div role="alert"><p>No se pudieron cargar las sucursales.</p><button onClick={reintentar}>Volver a consultar</button></div>}{!cargando&&!error&&!datos.length&&<p>No hay sucursales publicadas.</p>}
 {datos.length>0&&<div className="publico-sucursales-distribucion"><div className="publico-sucursales-lista">{datos.map(s=><article key={s.id} className={'publico-tarjeta-cms '+(activa?.id===s.id?'seleccionada':'')}><button type="button" aria-pressed={activa?.id===s.id} onClick={()=>setSeleccion(s.id)}><MapPin size={22}/><span>{s.nombre}{s.esPrincipal&&<small>Principal</small>}</span></button><p>{s.direccion}</p><p><Phone size={14}/><a href={'tel:'+s.telefono.replace(/[^+0-9]/g,'')}>{s.telefono}</a></p>{s.horarios&&<p><Clock size={14}/>{s.horarios}</p>}</article>)}</div><div className="publico-sucursal-mapa">{mapa?<iframe key={mapa} title={'Ubicación de '+activa.nombre} src={mapa} loading="lazy" referrerPolicy="no-referrer" sandbox="allow-scripts allow-same-origin allow-popups"/>:<div><MapPin size={48}/><h3>{activa.nombre}</h3><p>{activa.direccion}</p><a href={'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(activa.direccion)} target="_blank" rel="noopener noreferrer">Abrir ubicación en el mapa →</a></div>}</div></div>}
 <div className="publico-inicio-ver-todos"><Link className="publico-cta primary" to="/branches">Ver sucursales →</Link></div></div></section>
}
