import { useEffect,useRef,useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight,ChevronLeft,Check,RotateCcw,Sparkles } from 'lucide-react'
import type { DatosMarcoPublico } from '../api/cliente-marco-publico'
import { todasLasPaginas } from '../api/cliente-marco-publico'
import { cargarPublico } from '../api/cache-publica'
import { consultarPasosWizardPublico } from '../../cms/api/publico/cliente-pasos-wizard'
import { industriasPublicas,serviciosPublicos } from '../api/cliente-soluciones-publicas'
import { productosCatalogo } from '../api/cliente-catalogo-publico'
import { useRecursoPublico } from './use-recurso-publico'
import { configuracionAsistenteValida,opcionesAsistente,resumenAsistente,type DatosAsistente,type OpcionAsistente } from './datos-asistente-publico'
import { enlaceWhatsApp } from './datos-marco-publico'
import { IconoRedSocial } from './icono-red-social'
import type { PasoPublicado } from '../../../../shared/publico/cms'
import './captacion-publica.css'
const leerPasos=(signal?:AbortSignal)=>cargarPublico('pasos-wizard',()=>todasLasPaginas(consultarPasosWizardPublico),signal)
export function AsistentePublico({datos}:{datos:DatosMarcoPublico}){
 const {datos:pasos,elemento,error:errorPasos,reintentar}=useRecursoPublico(leerPasos,[] as PasoPublicado[])
 const [iniciado,setIniciado]=useState(false),[catalogo,setCatalogo]=useState<DatosAsistente|null>(null),[error,setError]=useState(''),[revision,setRevision]=useState(0),[indice,setIndice]=useState(0),[selecciones,setSelecciones]=useState<Record<string,OpcionAsistente[]>>({}),[resultado,setResultado]=useState(false),[busqueda,setBusqueda]=useState('')
 const titulo=useRef<HTMLHeadingElement>(null)
 useEffect(()=>{if(!iniciado)return;const c=new AbortController();setCatalogo(null);setError('');Promise.all([pasos.some(p=>p.fuenteDatos==='industrias')?industriasPublicas(c.signal):[],pasos.some(p=>['productos','categorias'].includes(p.fuenteDatos))?productosCatalogo(c.signal):[],pasos.some(p=>p.fuenteDatos==='servicios')?serviciosPublicos(c.signal):[]]).then(([industrias,productos,servicios])=>{if(!c.signal.aborted)setCatalogo({industrias,productos,servicios})}).catch(e=>{if(!c.signal.aborted)setError(e instanceof Error?e.message:'No se pudieron cargar las opciones')});return()=>c.abort()},[iniciado,pasos,revision])
 useEffect(()=>{if(iniciado)titulo.current?.focus();setBusqueda('')},[indice,resultado,iniciado])
 const paso=pasos[indice],seleccion=paso?selecciones[paso.identificador]||[]:[],opciones=paso&&catalogo?opcionesAsistente(paso,pasos,selecciones,catalogo):[],resumen=resumenAsistente(pasos,selecciones),whatsapp=enlaceWhatsApp({...datos.configuracion.whatsapp,mensaje:resumen})
 const validos=configuracionAsistenteValida(pasos)
 function elegir(o:OpcionAsistente){if(!paso)return;const existe=seleccion.some(s=>s.id===o.id);if(!existe&&paso.fuenteDatos!=='industrias'&&seleccion.length>=7)return
  const actual=paso.fuenteDatos==='industrias'?[o]:existe?seleccion.filter(s=>s.id!==o.id):[...seleccion,o]
  setSelecciones(s=>Object.fromEntries([...pasos.slice(0,indice).map(p=>[p.identificador,s[p.identificador]||[]]),[paso.identificador,actual]]))
 }
 return <section ref={elemento} className="asistente-publico" id="asistente-productos"><div className="publico-inicio-contenedor">
 {errorPasos?<div role="alert"><p>No se pudo cargar el asistente.</p><button onClick={reintentar}>Reintentar</button></div>:!pasos.length?null:!validos?<div className="asistente-intro"><h2>Te ayudamos a elegir</h2><p>Consulta con nuestro equipo para encontrar los productos que necesitas.</p><Link className="captacion-boton" to="/contact">Solicitar asesoramiento</Link></div>:<div className="asistente-panel">
  <div className="asistente-encabezado"><span><Sparkles size={18}/>Encuentra tu solución</span><h2 ref={titulo} tabIndex={-1}>{resultado?'Tu selección':iniciado?paso?.titulo:'¿Qué necesita tu industria?'}</h2><p>{resultado?'Consulta con nuestro equipo para recibir asesoramiento.':iniciado?paso?.descripcion:'Responde unas preguntas y prepara tu consulta de productos y servicios.'}</p></div>
  {!iniciado?<button className="captacion-boton" onClick={()=>setIniciado(true)}>Empezar <ArrowRight size={18}/></button>:error?<div role="alert"><p>{error}</p><button onClick={()=>setRevision(r=>r+1)}>Reintentar</button></div>:!catalogo?<p role="status">Cargando opciones…</p>:resultado?<div className="asistente-resultado"><dl>{pasos.map(p=><div key={p.id}><dt>{p.titulo}</dt><dd>{(selecciones[p.identificador]||[]).map(o=><span key={o.id}><Check size={16}/>{o.productoNombre?o.productoNombre+' · ':''}{o.nombre}</span>)}</dd></div>)}</dl><div className="asistente-acciones">{whatsapp&&<a className="captacion-boton" href={whatsapp} target="_blank" rel="noopener noreferrer"><IconoRedSocial nombre="faWhatsapp"/>Consultar por WhatsApp</a>}<Link className="captacion-boton" to="/contact" state={{consulta:resumen}}>Enviar consulta</Link><button onClick={()=>{setResultado(false);setIndice(0);setSelecciones({})}}><RotateCcw size={18}/>Empezar de nuevo</button><button onClick={()=>setResultado(false)}>Modificar selección</button></div></div>:<>
   <p className="asistente-progreso">Paso {indice+1} de {pasos.length} · {paso.fuenteDatos==='industrias'?'Selecciona una industria':'Selecciona hasta 7 opciones'}</p>
   <label className="asistente-busqueda">Buscar opciones<input type="search" value={busqueda} onChange={e=>setBusqueda(e.target.value)}/></label>
   <div className="asistente-opciones">{opciones.filter(o=>(o.nombre+' '+(o.productoNombre||'')).toLocaleLowerCase('es').includes(busqueda.toLocaleLowerCase('es'))).map(o=><button key={o.id} aria-pressed={seleccion.some(s=>s.id===o.id)} disabled={paso.fuenteDatos!=='industrias'&&seleccion.length>=7&&!seleccion.some(s=>s.id===o.id)} onClick={()=>elegir(o)}>{o.productoNombre&&<small>{o.productoNombre}</small>}<span>{o.nombre}</span>{seleccion.some(s=>s.id===o.id)&&<Check size={20}/>}</button>)}</div>
   {!opciones.length&&<p>No hay opciones disponibles para este paso. Puedes volver o <Link to="/contact">consultar directamente</Link>.</p>}
   <div className="asistente-acciones"><button disabled={indice===0} onClick={()=>setIndice(i=>i-1)}><ChevronLeft size={18}/>Anterior</button><span role="status">{seleccion.length} seleccionadas</span><button className="captacion-boton" disabled={!seleccion.length} onClick={()=>indice===pasos.length-1?setResultado(true):setIndice(i=>i+1)}>{indice===pasos.length-1?'Ver selección':'Continuar'}<ArrowRight size={18}/></button></div>
  </>}
 </div>}
 </div></section>
}
