import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Building2, Package, Wrench } from 'lucide-react'
import type { IndustriaPublica, ServicioPublico } from '../../../../shared/publico/catalogo'
import { imagenPublica } from './imagen-publica'
import { HtmlCms } from './html-cms'
export type TipoSolucion = 'industria' | 'servicio'
export function ImagenSolucion({src,nombre,tipo,prioritaria=false}:{src:string|null;nombre:string;tipo:TipoSolucion;prioritaria?:boolean}) {
 const [fallo,setFallo]=useState(false),url=imagenPublica(src),Icono=tipo==='industria'?Building2:Wrench
 return <div className="soluciones-imagen">{url&&!fallo?<img src={url} alt={nombre} width={640} height={400} loading={prioritaria?'eager':'lazy'} decoding="async" onError={()=>setFallo(true)}/>:<Icono aria-label={'Sin imagen: '+nombre} size={56}/>}</div>
}
export function TarjetaSolucion({item,tipo}:{item:IndustriaPublica|ServicioPublico;tipo:TipoSolucion}) {
 return <Link className="catalogo-tarjeta soluciones-tarjeta" to={(tipo==='industria'?'/applications/':'/services/')+encodeURIComponent(item.slug)}>
  <ImagenSolucion src={item.imagen} nombre={item.nombre} tipo={tipo}/>
  <div className="soluciones-tarjeta-contenido"><h3>{item.nombre}</h3>{'descripcion'in item&&item.descripcion&&<div className="soluciones-resumen"><HtmlCms html={item.descripcion}/></div>}
   <span className="soluciones-enlace">{tipo==='industria'?'Ver soluciones':'Más información'}<ArrowRight size={18}/></span>
  </div>
 </Link>
}
export function CabeceraSoluciones({nombre,tipo,listado,imagen}:{nombre:string;tipo:TipoSolucion;listado:boolean;imagen?:string|null}) {
 const Icono=tipo==='industria'?Building2:Wrench
 const titulo=listado&&tipo==='servicio'?'Nuestros Servicios':nombre
 const descripcion=tipo==='industria'?(listado?'Productos y servicios para los distintos sectores de la industria.':'Conoce los productos y servicios disponibles para este sector.'):(listado?'Soporte técnico y soluciones para acompañar tu operación.':'Conoce este servicio y consulta con nuestro equipo.')
 return <header className={'soluciones-cabecera '+(tipo==='industria'&&listado?'soluciones-cabecera-centrada':'')}>
  {imagenPublica(imagen??null)&&<img className="soluciones-cabecera-fondo" src={imagenPublica(imagen??null)} alt="" width={1920} height={600} decoding="async"/>}
  <div className="publico-inicio-contenedor soluciones-cabecera-interior">
   {tipo==='industria'&&listado?<span className="soluciones-insignia"><Icono size={18}/>Sectores que atendemos</span>:<span className="soluciones-icono-principal"><Icono size={42}/></span>}
   <div><h1>{titulo}</h1><p>{descripcion}</p></div>
  </div>
 </header>
}
export function TituloSoluciones({tipo,titulo,descripcion,cantidad}:{tipo:'categoria'|TipoSolucion;titulo:string;descripcion:string;cantidad?:number}) {
 const Icono=tipo==='categoria'?Package:tipo==='industria'?Building2:Wrench
 return <div className="soluciones-titulo"><span><Icono size={28}/></span><div><h2>{titulo}{cantidad!==undefined&&<small>{cantidad}</small>}</h2><p>{descripcion}</p></div></div>
}
export function VacioSoluciones({children}:{children:ReactNode}) {return <div className="soluciones-vacio"><Package size={38}/><p>{children}</p></div>}
