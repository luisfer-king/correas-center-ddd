import { useEffect, useState } from 'react'
import type { MenuPublicado } from '../../../../shared/publico/cms'
import type { DetalleProductoPublico } from '../../../../shared/publico/catalogo'
import { consultarProductosPublico } from '../../catalog/api/publico/cliente-productos'
import { consultarDetalleProductoPublico } from '../../catalog/api/publico/cliente-detalle-producto'
import { todasLasPaginas } from '../api/cliente-marco-publico'
import { imagenPublica } from './imagen-publica'
export function CategoriasDestinoProducto({ menu }: { menu: MenuPublicado }) {
 const [datos,setDatos] = useState<DetalleProductoPublico | null>(null), [error,setError] = useState(''), [cargando,setCargando] = useState(true)
 useEffect(() => {
  const controller = new AbortController();setDatos(null);setError('');setCargando(true)
  async function cargar() {
   // El ID vinculado en CMS es la identidad; no adivinar el producto a partir del texto del enlace.
   const productos = await todasLasPaginas(consultarProductosPublico,controller.signal)
   const producto = productos.find(p => p.id === menu.registroId)
   if (!producto) throw Error('El producto no está disponible.')
   const detalle = await consultarDetalleProductoPublico(producto.slug,controller.signal)
   if (!controller.signal.aborted) setDatos(detalle)
  }
  cargar().catch(e=>{if(!controller.signal.aborted)setError(e instanceof Error?e.message:'No se pudo consultar el producto.')}).finally(()=>{if(!controller.signal.aborted)setCargando(false)})
  return ()=>controller.abort()
 },[menu.registroId])
 if(cargando)return <p role="status">Cargando categorías…</p>
 if(error)return <p role="alert">{error}</p>
 return <section className="publico-categorias-producto"><h2> Todas las categorías</h2>{datos?.categorias.length ? <div className="publico-categorias-grid">{datos.categorias.map(c=><article key={c.id}>{imagenPublica(c.imagen)&&<img src={imagenPublica(c.imagen)} alt="" loading="lazy" />}<h3>{c.nombre}</h3>{c.descripcionCorta&&<p>{c.descripcionCorta}</p>}{c.uso&&<p>{c.uso}</p>}</article>)}</div>:<p>Este producto no tiene categorías publicadas.</p>}</section>
}
