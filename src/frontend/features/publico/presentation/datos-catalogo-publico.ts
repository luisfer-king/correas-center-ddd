import type { ProductoPublico, AtributoPublico } from '../../../../shared/publico/catalogo'
import type { MenuPublicado } from '../../../../shared/publico/cms'
import { normalizarRutaPublica } from './datos-marco-publico'
import { rutaProductoPublica, rutaCategoriaPublica } from '../../../../shared/publico/rutas'

export function esRutaCatalogo(ruta:string, menus:MenuPublicado[]) {
 return ruta === '/search' || ruta === '/products' || /^\/products\/[^/]+(?:\/[^/]+)?$/.test(ruta) || menus.some(m=>m.tipoRegistro==='producto' && (normalizarRutaPublica(m.ruta)===ruta || m.items.some(i=>normalizarRutaPublica(i.ruta)===ruta)))
}
export function rutaProducto(p:{id:string;slug:string}, _menus:MenuPublicado[]) {return rutaProductoPublica(p.slug)}
export function rutaCategoria(p:{id:string;slug:string}, c:{id:string;slug:string;detalleDisponible?:boolean}, menus:MenuPublicado[]) {
 const configurados=menus.filter(m=>m.tipoRegistro==='producto'&&m.registroId===p.id)
 return c.detalleDisponible===false||(configurados.length>0&&!configurados.some(m=>m.cargarSubmenu))? rutaProductoPublica(p.slug):rutaCategoriaPublica(p.slug,c.slug)
}
export const normalizarBusqueda = (s:string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('es').trim()
export function filtrarProductos(items:ProductoPublico[], q:string, marca:string, uso:string, orden:string) {
 const texto=normalizarBusqueda(q)
 const resultado=items.filter(p=>(!marca||p.marcas?.some(m=>m.id===marca))&&(!uso||p.categorias?.some(c=>c.uso===uso))&&(!texto||normalizarBusqueda([p.nombre,...(p.marcas??[]).map(m=>m.nombre),...(p.categorias??[]).flatMap(c=>[c.nombre,c.uso??''])].join(' ')).includes(texto)))
 return resultado.sort((a,b)=>orden==='nombre_asc'?a.nombre.localeCompare(b.nombre,'es'):orden==='nombre_desc'?b.nombre.localeCompare(a.nombre,'es'):orden==='categorias'?(b.categorias?.length??0)-(a.categorias?.length??0):a.orden-b.orden)
}
export function valorAtributo(a:AtributoPublico) {
 if (a.valor === null) return 'Sin especificar'
 return (typeof a.valor==='boolean' ? a.valor?'Sí':'No' : a.valor)+(a.tipoDato==='numero'&&a.unidadMedida?' '+a.unidadMedida:'')
}
