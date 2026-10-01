import { asignaciones_marcaApi } from '../api/asignaciones-marca'
import type { AsignacionMarcaCatalogo } from '../api/tipos-catalogo'
import type { ConfiguracionCatalogo } from './configuracion-catalogo'
import { ListadoCatalogo } from './listado-catalogo'
const config: ConfiguracionCatalogo<AsignacionMarcaCatalogo> = {
  recurso: 'asignaciones-marca', titulo: 'Marcas de productos', descripcion: 'Relaciona marcas con productos.',
  columnas: [{ clave: 'productoId', etiqueta: 'Producto id' }, { clave: 'marcaId', etiqueta: 'Marca id' }, { clave: 'orden', etiqueta: 'Orden' }],
  campos: [{ clave: 'productoId', etiqueta: 'Producto', obligatorio: true, referencia: 'productos', soloCrear: true }, { clave: 'marcaId', etiqueta: 'Marca', obligatorio: true, referencia: 'marcas', soloCrear: true }, { clave: 'orden', etiqueta: 'Orden', tipo: 'number-nullable' }],
  filtro: { clave: 'productoId', etiqueta: 'Producto', referencia: 'productos', obligatorio: true },
  listar: asignaciones_marcaApi.listar, obtener: asignaciones_marcaApi.obtener, crear: asignaciones_marcaApi.crear,
  editar: asignaciones_marcaApi.editar,  cambiar: asignaciones_marcaApi.cambiar,
}
export function VistaAsignacionesMarca() { return <ListadoCatalogo config={config} /> }
