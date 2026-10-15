import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Grid3X3, List } from 'lucide-react'
import type { ProductoPublico } from '../../../../shared/publico/catalogo'
import type { MenuPublicado } from '../../../../shared/publico/cms'
import { productosCatalogo } from '../api/cliente-catalogo-publico'
import { filtrarProductos } from './datos-catalogo-publico'
import { CabeceraCatalogo, SinResultado, TarjetaProducto } from './componentes-catalogo'

export function ListadoProductosPublico({menus}:{menus:MenuPublicado[]}) {
 const [params,setParams]=useSearchParams(),[items,setItems]=useState<ProductoPublico[]>([]),[error,setError]=useState(''),[cargando,setCargando]=useState(true),[revision,setRevision]=useState(0)
 const q=params.get('q')??'',marca=params.get('marca')??'',uso=params.get('uso')??'',orden=params.get('orden')??'orden',vista=params.get('vista')==='lista'?'lista':'grid'
 useEffect(()=>{const c=new AbortController();setCargando(true);setError('');productosCatalogo(c.signal).then(setItems).catch(e=>{if(!c.signal.aborted)setError(e instanceof Error?e.message:'No se pudo cargar el catálogo')}).finally(()=>{if(!c.signal.aborted)setCargando(false)});return()=>c.abort()},[revision])
 const marcas=[...new Map(items.flatMap(p=>(p.marcas??[]).map(m=>[m.id,m] as const))).values()].sort((a,b)=>a.nombre.localeCompare(b.nombre,'es'))
 const usos=[...new Set(items.flatMap(p=>(p.categorias??[]).flatMap(c=>c.uso?[c.uso]:[])))].sort()
 const filtrados=filtrarProductos(items,q,marca,uso,orden),totalPaginas=Math.max(1,Math.ceil(filtrados.length/12)),n=Number(params.get('pagina')),pagina=Number.isSafeInteger(n)&&n>0?Math.min(n,totalPaginas):1
 function cambiar(k:string,v:string){const p=new URLSearchParams(params);v?p.set(k,v):p.delete(k);if(k!=='pagina')p.delete('pagina');setParams(p,{replace:k==='q'})}
 return <><CabeceraCatalogo titulo="Nuestros Productos" descripcion="Explora nuestro catálogo de productos industriales y marcas disponibles."/>
  <section className="catalogo-filtros"><div className="publico-inicio-contenedor"><label>Buscar productos, marcas o usos<input type="search" value={q} maxLength={120} onChange={e=>cambiar('q',e.target.value)} placeholder="¿Qué necesitas?"/></label><label>Marca<select value={marca} onChange={e=>cambiar('marca',e.target.value)}><option value="">Todas las marcas</option>{marcas.map(m=><option key={m.id} value={m.id}>{m.nombre}</option>)}</select></label><label>Uso<select value={uso} onChange={e=>cambiar('uso',e.target.value)}><option value="">Todos los usos</option>{usos.map(u=><option key={u}>{u}</option>)}</select></label><label>Ordenar<select value={orden} onChange={e=>cambiar('orden',e.target.value)}><option value="orden">Orden predeterminado</option><option value="nombre_asc">Nombre (A–Z)</option><option value="nombre_desc">Nombre (Z–A)</option><option value="categorias">Más categorías</option></select></label><div className="catalogo-vistas"><button aria-label="Vista cuadrícula" aria-pressed={vista==='grid'} onClick={()=>cambiar('vista','grid')}><Grid3X3 size={18}/></button><button aria-label="Vista lista" aria-pressed={vista==='lista'} onClick={()=>cambiar('vista','lista')}><List size={18}/></button></div><button onClick={()=>setParams({})}>Limpiar filtros</button></div></section>
  <section className="catalogo-contenido publico-inicio-contenedor">{cargando?<p role="status">Cargando productos…</p>:error?<div role="alert"><p>{error}</p><button onClick={()=>setRevision(r=>r+1)}>Reintentar</button></div>:<><p role="status">{filtrados.length} de {items.length} productos</p><div className={'catalogo-grid '+(vista==='lista'?'catalogo-lista':'')}>{filtrados.slice((pagina-1)*12,pagina*12).map(p=><TarjetaProducto key={p.id} producto={p} menus={menus}/>)}</div>{!filtrados.length&&<SinResultado/>}{totalPaginas>1&&<nav className="catalogo-paginacion" aria-label="Páginas de productos"><button disabled={pagina===1} onClick={()=>cambiar('pagina',String(pagina-1))}>Anterior</button><span>Página {pagina} de {totalPaginas}</span><button disabled={pagina===totalPaginas} onClick={()=>cambiar('pagina',String(pagina+1))}>Siguiente</button></nav>}</>}</section>
 </>
}
