import { consultarProductosPublico } from '../../catalog/api/publico/cliente-productos'
import { consultarCategoriasPublico } from '../../catalog/api/publico/cliente-categorias'
import { consultarDetalleProductoPublico } from '../../catalog/api/publico/cliente-detalle-producto'
import { todasLasPaginas } from './cliente-marco-publico'
import { cargarPublico } from './cache-publica'

export const productosCatalogo = (signal?: AbortSignal) => cargarPublico('catalogo-productos', () => todasLasPaginas(consultarProductosPublico), signal)
export const detalleProducto = (slug: string, signal?: AbortSignal) => cargarPublico('producto:'+slug, () => consultarDetalleProductoPublico(slug), signal)
export const detalleCategoria = (productoSlug: string, slug: string, signal?: AbortSignal) => cargarPublico('categoria:'+JSON.stringify([productoSlug,slug]), () => consultarCategoriasPublico({ productoSlug, slug, limite:1 }).then(p => p.items[0] ?? null), signal)
export const buscarProductos = (q:string, desplazamiento:number, signal?:AbortSignal) => consultarProductosPublico({q,desplazamiento,limite:12},signal)
export const buscarCategorias = (q:string, desplazamiento:number, signal?:AbortSignal) => consultarCategoriasPublico({q,desplazamiento,limite:12},signal)
