import { useEffect, useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import type { ProductoPublico, CategoriaPublica } from '../../../../shared/publico/catalogo'
import type { MenuPublicado } from '../../../../shared/publico/cms'
import type { PaginaPublica } from '../../../../shared/publico/comun'
import { buscarProductos, buscarCategorias } from '../api/cliente-catalogo-publico'
import { CabeceraCatalogo, ImagenCatalogo, SinResultado, TarjetaProducto } from './componentes-catalogo'
import { rutaCategoria } from './datos-catalogo-publico'

function ResultadosBusqueda({q,menus,tipo}:{q:string;menus:MenuPublicado[];tipo:'productos'|'categorias'}) {
 const [items,setItems]=useState<(ProductoPublico|CategoriaPublica)[]>([]),[hayMas,setHayMas]=useState(false),[offset,setOffset]=useState(0),[cargando,setCargando]=useState(true),[error,setError]=useState(''),[revision,setRevision]=useState(0)
 useEffect(()=>{const c=new AbortController();setCargando(true);setError('');const leer=tipo==='productos'?buscarProductos:buscarCategorias
  leer(q,offset,c.signal).then((p:PaginaPublica<ProductoPublico|CategoriaPublica>)=>{if(!c.signal.aborted){setItems(v=>offset?[...v,...p.items.filter(i=>!v.some(x=>x.id===i.id))]:p.items);setHayMas(p.hayMas)}}).catch(e=>{if(!c.signal.aborted)setError(e instanceof Error?e.message:'No se pudo buscar')}).finally(()=>{if(!c.signal.aborted)setCargando(false)});return()=>c.abort()
 },[q,offset,tipo,revision])
 return <section className="catalogo-resultados"><h2>{tipo==='productos'?'Productos':'Categorías'}</h2><p>{items.length} resultados cargados{hayMas?' · Hay más disponibles':''}</p>{error&&<div role="alert"><p>{error}</p><button onClick={()=>setRevision(r=>r+1)}>Reintentar</button></div>}<div className={'catalogo-grid '+(tipo==='categorias'?'catalogo-grid-tres':'')}>{items.map(i=>tipo==='productos'?<TarjetaProducto key={i.id} producto={i as ProductoPublico} menus={menus}/>:<Link key={i.id} className="catalogo-tarjeta" to={rutaCategoria((i as CategoriaPublica).producto,i,menus)}><ImagenCatalogo src={(i as CategoriaPublica).imagen} nombre={i.nombre}/><div className="catalogo-tarjeta-texto"><span className="catalogo-etiqueta">{(i as CategoriaPublica).producto.nombre}</span><h3>{i.nombre}</h3><p>{(i as CategoriaPublica).descripcionCorta}</p><span className="catalogo-detalles">{(i as CategoriaPublica).detalleDisponible===false?'Ver categorías del producto →':'Ver detalles →'}</span></div></Link>)}</div>{cargando&&<p role="status">Buscando {tipo}…</p>}{!cargando&&!error&&!items.length&&<SinResultado titulo={'Sin '+tipo+' para “'+q+'”'}/>} {hayMas&&offset<9996&&<button disabled={cargando||!!error} onClick={()=>setOffset(n=>n+12)}>Ver más {tipo}</button>}</section>
}
export function BusquedaPublica({menus}:{menus:MenuPublicado[]}) {
 const [params,setParams]=useSearchParams(),q=(params.get('q')??'').trim(),[texto,setTexto]=useState(q)
 useEffect(()=>setTexto(q),[q])
 const valido=q.length>=2&&q.length<=100
 function enviar(e:FormEvent){e.preventDefault();setParams(texto.trim()?{q:texto.trim()}:{})}
 return <><CabeceraCatalogo titulo={valido?'Resultados para “'+q+'”':'Buscar en el catálogo'} descripcion="Encuentra productos y categorías por su nombre."/><section className="catalogo-contenido publico-inicio-contenedor"><form className="catalogo-buscador" onSubmit={enviar}><label>Buscar<input type="search" value={texto} maxLength={100} onChange={e=>setTexto(e.target.value)} placeholder="Ej.: correas"/></label><button type="submit">Buscar</button></form>{valido?<><ResultadosBusqueda key={q+'-p'} q={q} menus={menus} tipo="productos"/><ResultadosBusqueda key={q+'-c'} q={q} menus={menus} tipo="categorias"/></>:<p>Escribe entre 2 y 100 caracteres para buscar.</p>}</section></>
}
