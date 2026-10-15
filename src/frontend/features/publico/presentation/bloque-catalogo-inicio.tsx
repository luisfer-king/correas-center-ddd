import { Package } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { DatosMarcoPublico } from '../api/cliente-marco-publico'
import { useRecursoPublico } from './use-recurso-publico'
import { imagenPublica } from './imagen-publica'
interface TarjetaInicio { id:string;nombre:string;slug?:string;imagen?:string|null;logo?:string|null;descripcion?:string|null }
export function BloqueCatalogoInicio<T extends TarjetaInicio>({titulo,subtitulo,tipo,lista,leer,datos}:{titulo:string;subtitulo:string;tipo:string;lista:string;leer:(signal?:AbortSignal)=>Promise<T[]>;datos:DatosMarcoPublico}) {
 const {datos:items,error,cargando,elemento,reintentar}=useRecursoPublico(leer,[] as T[])
 return <section className={'publico-bloque-inicio '+(tipo==='marca'?'publico-bloque-marcas':'publico-bloque-'+tipo)} ref={elemento}><div className="publico-inicio-contenedor"><div className="publico-titulo-inicio"><span>{subtitulo}</span><h2>{titulo}</h2></div>
  {cargando&&!items.length&&<div className="publico-esqueleto-grid" role="status" aria-label={'Cargando '+titulo}>{[1,2,3,4].map(i=><div key={i} />)}</div>}
  {error&&<div role="alert"><p>No se pudo cargar esta sección.</p><button onClick={reintentar}>Reintentar</button></div>}
  {!cargando&&!error&&!items.length&&<p className="publico-sin-contenido">No hay elementos publicados en esta sección.</p>}
  <div className={tipo==='marca'?'publico-marcas-inicio':'publico-grid-inicio'}>{items.map(item=>{
   const imagen=imagenPublica(item.logo||item.imagen||null), ruta=datos.menus.find(m=>m.tipoRegistro===tipo&&m.registroId===item.id)?.ruta||(item.slug&&['producto','industria','servicio'].includes(tipo)?(tipo==='producto'?'/products/':tipo==='industria'?'/applications/':'/services/')+encodeURIComponent(item.slug):lista)
   const interior=<>{tipo==='marca'&&imagen&&<img src={imagen} alt={item.nombre} width={160} height={90} loading="lazy" decoding="async"/>}{tipo!=='marca'&&<div className="publico-tarjeta-imagen">{imagen?<><img src={imagen} alt={tipo==='marca'?item.nombre:''} width={tipo==='marca'?160:400} height={tipo==='marca'?90:240} loading="lazy" decoding="async" onError={e=>{e.currentTarget.hidden=true;e.currentTarget.nextElementSibling?.removeAttribute('hidden')}}/><span hidden><Package size={48}/></span></>:<Package size={48}/>}</div>}{tipo!=='marca'&&<div><h3>{item.nombre}</h3>{item.descripcion&&<p>{item.descripcion}</p>}<span className="publico-tarjeta-ver">Ver más →</span></div>}</>
   return tipo==='marca'?<div key={item.id} className="publico-marca" title={item.nombre}>{interior}{!imagen&&<span>{item.nombre}</span>}</div>:<Link key={item.id} className="publico-tarjeta-inicio" to={ruta}>{interior}</Link>
  })}</div>{tipo!=='marca'&&<div className="publico-inicio-ver-todos"><Link className="publico-cta primary" to={lista}>Ver todos</Link></div>}
 </div></section>
}
