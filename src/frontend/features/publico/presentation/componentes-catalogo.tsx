import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, ArrowRight } from 'lucide-react'
import type { ProductoPublico, MarcaPublica } from '../../../../shared/publico/catalogo'
import type { MenuPublicado } from '../../../../shared/publico/cms'
import { imagenPublica } from './imagen-publica'
import { rutaProducto } from './datos-catalogo-publico'

export function ImagenCatalogo({src,nombre,prioritaria=false}:{src:string|null;nombre:string;prioritaria?:boolean}) {
 const [fallo,setFallo]=useState(false), url=imagenPublica(src)
 return <div className="catalogo-imagen">{url&&!fallo?<img src={url} alt={nombre} width={400} height={250} loading={prioritaria?'eager':'lazy'} decoding="async" onError={()=>setFallo(true)} />:<Package size={52} aria-label={'Sin imagen: '+nombre} />}</div>
}
export function columnasMarcas(n:number){return n<=3||n===5||n%3===0?3:4}
export function MarcasProducto({marcas}:{marcas:MarcaPublica[]}) {
 return <div className={"catalogo-marcas marcas-"+columnasMarcas(marcas.length)}>{marcas.map(m=><div key={m.id} title={m.nombre}>{imagenPublica(m.logo)?<img src={imagenPublica(m.logo)} alt={m.nombre} width={80} height={45} loading="lazy" decoding="async" onError={e=>{e.currentTarget.hidden=true;e.currentTarget.nextElementSibling?.removeAttribute('hidden')}}/>:null}<span hidden={!!imagenPublica(m.logo)}>{m.nombre}</span></div>)}</div>
}
export function TarjetaProducto({producto:p,menus}:{producto:ProductoPublico;menus:MenuPublicado[]}) {
 return <Link className="catalogo-tarjeta" to={rutaProducto(p,menus)}><ImagenCatalogo src={p.imagen} nombre={p.nombre}/><div className="catalogo-tarjeta-texto"><h2>{p.nombre}</h2>{p.categorias?.[0]?.uso&&<span className="catalogo-etiqueta">{p.categorias[0].uso}</span>}{!!p.marcas?.length&&<><p>Marcas disponibles</p><MarcasProducto marcas={p.marcas.slice(0,8)}/>{p.marcas.length>8&&<small>+{p.marcas.length-8} marcas</small>}</>}<div className="catalogo-tarjeta-pie">{p.categorias&&<span>{p.categorias.length} categorías</span>}<span>Ver detalles <ArrowRight size={16}/></span></div></div></Link>
}
export function CabeceraCatalogo({titulo,descripcion,imagen}:{titulo:string;descripcion?:string|null;imagen?:string|null}) {
 return <header className="catalogo-cabecera">{imagenPublica(imagen??null)&&<img className="catalogo-cabecera-fondo" src={imagenPublica(imagen??null)} alt="" width={1920} height={600} decoding="async"/>}<div className="publico-inicio-contenedor"><span className="catalogo-etiqueta">Soluciones industriales</span><h1>{titulo}</h1>{descripcion&&<p>{descripcion}</p>}</div></header>
}
export function SinResultado({titulo='Sin resultados'}:{titulo?:string}) {
 return <div className="catalogo-vacio"><Package size={48}/><h2>{titulo}</h2><p>Explora el catálogo o consulta con nuestro equipo.</p><Link to="/products" className="publico-cta primary">Ver productos</Link></div>
}
