import { tipos_atributoApi } from '../api/tipos-atributo'
import type { TipoAtributoCatalogo } from '../api/tipos-catalogo'
import type { ConfiguracionCatalogo } from './configuracion-catalogo'
import { ListadoCatalogo } from './listado-catalogo'
const config: ConfiguracionCatalogo<TipoAtributoCatalogo> = {
  recurso: 'tipos-atributo', titulo: 'Tipos de atributo', descripcion: 'Define los valores permitidos para cada tipo.',
  columnas: [{ clave: 'nombre', etiqueta: 'Nombre' }, { clave: 'slug', etiqueta: 'Slug' }, { clave: 'orden', etiqueta: 'Orden' }],
  campos: [{ clave: 'nombre', etiqueta: 'Nombre', obligatorio: true }, { clave: 'slug', etiqueta: 'Slug', obligatorio: true, soloCrear: true, ayuda: 'Identificador de URL; no se puede modificar después de crear.' }, { clave: 'descripcion', etiqueta: 'Descripción', tipo: 'textarea' }, { clave: 'icono', etiqueta: 'Icono' }, { clave: 'capacidades.descripcion', etiqueta: 'Permite descripción', tipo: 'checkbox' }, { clave: 'capacidades.numero', etiqueta: 'Permite número', tipo: 'checkbox' }, { clave: 'capacidades.unidad', etiqueta: 'Permite unidad', tipo: 'checkbox' }, { clave: 'orden', etiqueta: 'Orden', tipo: 'number', obligatorio: true, soloCrear: true }],
  
  listar: tipos_atributoApi.listar, obtener: tipos_atributoApi.obtener, crear: tipos_atributoApi.crear,
  editar: tipos_atributoApi.editar, reordenar: tipos_atributoApi.reordenar, cambiar: tipos_atributoApi.cambiar,
}
export function VistaTiposAtributo() { return <ListadoCatalogo config={config} /> }
