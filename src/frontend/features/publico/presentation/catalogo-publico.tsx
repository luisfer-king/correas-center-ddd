import { useEffect, useState } from 'react'
import type { CategoriaPublica, DetalleProductoPublico } from '../../../../shared/publico/catalogo'
import type { DatosMarcoPublico } from '../api/cliente-marco-publico'
import { productosCatalogo, detalleProducto, detalleCategoria } from '../api/cliente-catalogo-publico'
import { normalizarRutaPublica } from './datos-marco-publico'
import { rutaProducto } from './datos-catalogo-publico'
import { ListadoProductosPublico } from './listado-productos-publico'
import { ProductoCatalogo, CategoriaCatalogo } from './detalle-catalogo-publico'
import { BusquedaPublica } from './busqueda-publica'
import { BreadcrumbsPublico } from './breadcrumbs-publico'
import { SinResultado } from './componentes-catalogo'
import './catalogo-publico.css'

function DetalleCatalogo({ruta,datos}:{ruta:string;datos:DatosMarcoPublico}) {
 const [producto,setProducto]=useState<DetalleProductoPublico|null>(null),[categoria,setCategoria]=useState<CategoriaPublica|null>(null),[cargando,setCargando]=useState(true),[error,setError]=useState(''),[ausente,setAusente]=useState(false),[revision,setRevision]=useState(0)
 useEffect(()=>{const c=new AbortController();setProducto(null);setCategoria(null);setCargando(true);setError('');setAusente(false)
  async function cargar(){
   const menu=datos.menus.find(m=>m.tipoRegistro==='producto'&&(normalizarRutaPublica(m.ruta)===ruta||m.items.some(i=>normalizarRutaPublica(i.ruta)===ruta)))
   let slug:string,categoriaSlug:string|undefined
   if(menu){const p=(await productosCatalogo(c.signal)).find(p=>p.id===menu.registroId);if(!p)return null;slug=p.slug
    const item=normalizarRutaPublica(menu.ruta)===ruta?undefined:menu.items.find(i=>normalizarRutaPublica(i.ruta)===ruta)
    if(item){if(!menu.cargarSubmenu)return null;const detalle=await detalleProducto(slug,c.signal);categoriaSlug=detalle.categorias.find(c=>c.id===item.categoriaId)?.slug;if(!categoriaSlug)return null}
   }else{const partes=ruta.split('/').slice(2);try{slug=decodeURIComponent(partes[0]);categoriaSlug=partes[1]?decodeURIComponent(partes[1]):undefined}catch{return null}if(!slug||/[\/\\\s]/.test(slug)||(categoriaSlug&&/[\/\\\s]/.test(categoriaSlug)))return null}
   if(categoriaSlug){const p=await detalleProducto(slug,c.signal);if(p.detalleCategoriasDisponible===false)return null}
   return categoriaSlug?{categoria:await detalleCategoria(slug,categoriaSlug,c.signal)}:{producto:await detalleProducto(slug,c.signal)}
  }
  cargar().then(r=>{if(c.signal.aborted)return;if(!r||('categoria'in r&&(!r.categoria||r.categoria.detalleDisponible===false))){setAusente(true);return}if('producto'in r)setProducto(r.producto!);else setCategoria(r.categoria!)}).catch(e=>{if(!c.signal.aborted){if(e?.estado===404)setAusente(true);else setError(e instanceof Error?e.message:'No se pudo consultar el recurso')}}).finally(()=>{if(!c.signal.aborted)setCargando(false)})
  return()=>c.abort()
 },[ruta,datos.menus,revision])
 const nombre=categoria?.nombre??producto?.nombre??'Catálogo'
 useEffect(()=>{document.title=(ausente?'Recurso no disponible':nombre)+' | '+datos.empresa.nombre},[nombre,ausente,datos.empresa.nombre])
 return <><BreadcrumbsPublico nombre={nombre} padre={categoria?{nombre:categoria.producto.nombre,ruta:rutaProducto(categoria.producto,datos.menus)}:{nombre:'Productos',ruta:'/products'}}/>{cargando?<p className="catalogo-estado" role="status">Cargando catálogo…</p>:error?<section className="catalogo-estado" role="alert"><p>{error}</p><button onClick={()=>setRevision(r=>r+1)}>Reintentar</button></section>:ausente?<SinResultado titulo="Recurso no disponible"/>:categoria?<CategoriaCatalogo categoria={categoria} datos={datos}/>:producto?<ProductoCatalogo producto={producto} datos={datos}/>:null}</>
}
export function CatalogoPublico({ruta,datos}:{ruta:string;datos:DatosMarcoPublico}) {
 return ruta==='/products'?<><BreadcrumbsPublico nombre="Productos"/><ListadoProductosPublico menus={datos.menus}/></>:ruta==='/search'?<><BreadcrumbsPublico nombre="Buscar"/><BusquedaPublica menus={datos.menus}/></>:<DetalleCatalogo ruta={ruta} datos={datos}/>
}
