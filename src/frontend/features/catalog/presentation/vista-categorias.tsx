import { categoriasApi } from '../api/categorias'
import type { CategoriaCatalogo } from '../api/tipos-catalogo'
import type { ConfiguracionCatalogo } from './configuracion-catalogo'
import { ListadoCatalogo } from './listado-catalogo'
const config: ConfiguracionCatalogo<CategoriaCatalogo> = {
  recurso: 'categorias', titulo: 'Categorías', descripcion: 'Categorías y usos de los productos.',
  columnas: [{ clave: 'nombre', etiqueta: 'Nombre' }, { clave: 'slug', etiqueta: 'Slug' }, { clave: 'productoId', etiqueta: 'Producto id' }, { clave: 'orden', etiqueta: 'Orden' }],
  campos: [{ clave: 'productoId', etiqueta: 'Producto', obligatorio: true, referencia: 'productos', soloCrear: true }, { clave: 'nombre', etiqueta: 'Nombre', obligatorio: true }, { clave: 'slug', etiqueta: 'Slug', obligatorio: true, soloCrear: true, ayuda: 'Identificador de URL; no se puede modificar después de crear.' }, { clave: 'imagen', etiqueta: 'URL de imagen' }, { clave: 'descripcion', etiqueta: 'Descripción', tipo: 'textarea' }, { clave: 'descripcionCorta', etiqueta: 'Descripción corta', tipo: 'textarea' }, { clave: 'uso', etiqueta: 'Uso', tipo: 'textarea' }, { clave: 'orden', etiqueta: 'Orden', tipo: 'number', obligatorio: true, soloCrear: true }],
  filtro: { clave: 'productoId', etiqueta: 'Producto', referencia: 'productos' },
  listar: categoriasApi.listar, obtener: categoriasApi.obtener, crear: categoriasApi.crear,
  editar: categoriasApi.editar, reordenar: categoriasApi.reordenar, cambiar: categoriasApi.cambiar,
}
export function VistaCategorias() { return <ListadoCatalogo config={config} /> }
