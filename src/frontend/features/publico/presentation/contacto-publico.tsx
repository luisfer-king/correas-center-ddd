import { useEffect,useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Mail,MapPin,Phone,Clock } from 'lucide-react'
import type { DatosMarcoPublico } from '../api/cliente-marco-publico'
import type { SucursalPublica } from '../../../../shared/publico/comun'
import { sucursalesPublicas } from '../api/cliente-contenido-publico'
import { FormularioContactoPublico } from './formulario-contacto-publico'
import { enlaceWhatsApp } from './datos-marco-publico'
import { IconoRedSocial } from './icono-red-social'
import './captacion-publica.css'
export function ContactoPublico({datos}:{datos:DatosMarcoPublico}){
 const [sucursales,setSucursales]=useState<SucursalPublica[]>([]),[error,setError]=useState(false),[revision,setRevision]=useState(0),location=useLocation()
 useEffect(()=>{const c=new AbortController();setError(false);sucursalesPublicas(c.signal).then(s=>{if(!c.signal.aborted)setSucursales(s)}).catch(()=>{if(!c.signal.aborted)setError(true)});return()=>c.abort()},[revision])
 const principal=sucursales.find(s=>s.esPrincipal)||sucursales[0],whatsapp=enlaceWhatsApp(datos.configuracion.whatsapp)
 const resumen=typeof location.state?.consulta==='string'?location.state.consulta.slice(0,5000):''
 return <div className="captacion-publica"><header className="captacion-cabecera"><div className="publico-inicio-contenedor"><span>Estamos para ayudarte</span><h1>Contáctanos</h1><p>Consulta sobre nuestros productos y servicios. Conversemos sobre lo que tu empresa necesita.</p></div></header><section className="publico-inicio-contenedor captacion-contacto"><aside><h2>Hablemos de tu proyecto</h2><p>Encuentra nuestros datos de contacto o envíanos tu consulta.</p>{principal&&<><article><MapPin/><div><h3>{principal.nombre}</h3><p>{principal.direccion}</p></div></article><article><Phone/><div><h3>Teléfono</h3><a href={'tel:'+principal.telefono.replace(/[^+0-9]/g,'')}>{principal.telefono}</a></div></article>{principal.email&&<article><Mail/><div><h3>Correo electrónico</h3><a href={'mailto:'+principal.email}>{principal.email}</a></div></article>}{principal.horarios&&<article><Clock/><div><h3>Horarios de atención</h3><p>{principal.horarios}</p></div></article>}</>}{error&&<p role="alert">No se pudieron cargar las sucursales. <button onClick={()=>setRevision(r=>r+1)}>Reintentar</button></p>}{whatsapp&&<a className="captacion-whatsapp" href={whatsapp} target="_blank" rel="noopener noreferrer"><IconoRedSocial nombre="faWhatsapp"/>Consultar por WhatsApp</a>}</aside><FormularioContactoPublico mensajeInicial={resumen}/></section></div>
}
