import { productosApi } from '../api/productos'
import type { ProductoCatalogo } from '../api/tipos-catalogo'
import type { ConfiguracionCatalogo } from './configuracion-catalogo'
import { ListadoCatalogo } from './listado-catalogo'
const config: ConfiguracionCatalogo<ProductoCatalogo> = {
  recurso: 'productos', titulo: 'Productos', descripcion: 'Productos asociados a una empresa.',
  columnas: [{ clave: 'nombre', etiqueta: 'Nombre' }, { clave: 'slug', etiqueta: 'Slug' }, { clave: 'empresaId', etiqueta: 'Empresa id' }, { clave: 'orden', etiqueta: 'Orden' }],
  campos: [{ clave: 'empresaId', etiqueta: 'Empresa', obligatorio: true, referencia: 'empresas', soloCrear: true }, { clave: 'nombre', etiqueta: 'Nombre', obligatorio: true }, { clave: 'slug', etiqueta: 'Slug', obligatorio: true, soloCrear: true, ayuda: 'Identificador de URL; no se puede modificar después de crear.' }, { clave: 'imagen', etiqueta: 'URL de imagen' }, { clave: 'orden', etiqueta: 'Orden', tipo: 'number', obligatorio: true, soloCrear: true }],
  filtro: { clave: 'empresaId', etiqueta: 'Empresa', referencia: 'empresas' },
  listar: productosApi.listar, obtener: productosApi.obtener, crear: productosApi.crear,
  editar: productosApi.editar, reordenar: productosApi.reordenar, cambiar: productosApi.cambiar,
}
export function VistaProductos() { return <ListadoCatalogo config={config} /> }
