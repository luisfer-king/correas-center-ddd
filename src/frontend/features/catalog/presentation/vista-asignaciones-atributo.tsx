import { asignaciones_atributoApi } from '../api/asignaciones-atributo'
import type { AsignacionAtributoCatalogo } from '../api/tipos-catalogo'
import type { ConfiguracionCatalogo } from './configuracion-catalogo'
import { ListadoCatalogo } from './listado-catalogo'
const config: ConfiguracionCatalogo<AsignacionAtributoCatalogo> = {
  recurso: 'asignaciones-atributo', titulo: 'Atributos de categorías', descripcion: 'Asigna atributos técnicos a cada categoría.',
  columnas: [{ clave: 'categoriaId', etiqueta: 'Categoria id' }, { clave: 'atributoId', etiqueta: 'Atributo id' }, { clave: 'valorPersonalizado', etiqueta: 'Valorpersonalizado' }, { clave: 'orden', etiqueta: 'Orden' }],
  campos: [{ clave: 'categoriaId', etiqueta: 'Categoría', obligatorio: true, referencia: 'categorias', soloCrear: true }, { clave: 'atributoId', etiqueta: 'Atributo técnico', obligatorio: true, referencia: 'atributos-tecnicos', soloCrear: true }, { clave: 'valorPersonalizado', etiqueta: 'Valor numérico personalizado', tipo: 'decimal' }, { clave: 'orden', etiqueta: 'Orden', tipo: 'number', obligatorio: true }],
  filtro: { clave: 'categoriaId', etiqueta: 'Categoría', referencia: 'categorias', obligatorio: true },
  listar: asignaciones_atributoApi.listar, obtener: asignaciones_atributoApi.obtener, crear: asignaciones_atributoApi.crear,
  editar: asignaciones_atributoApi.editar,  cambiar: asignaciones_atributoApi.cambiar,
}
export function VistaAsignacionesAtributo() { return <ListadoCatalogo config={config} /> }
