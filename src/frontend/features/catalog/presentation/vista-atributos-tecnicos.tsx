import { atributos_tecnicosApi } from '../api/atributos-tecnicos'
import type { AtributoTecnicoCatalogo } from '../api/tipos-catalogo'
import type { ConfiguracionCatalogo } from './configuracion-catalogo'
import { ListadoCatalogo } from './listado-catalogo'
const config: ConfiguracionCatalogo<AtributoTecnicoCatalogo> = {
  recurso: 'atributos-tecnicos', titulo: 'Atributos técnicos', descripcion: 'Valores técnicos asociados a un tipo.',
  columnas: [{ clave: 'nombre', etiqueta: 'Nombre' }, { clave: 'tipoAtributoId', etiqueta: 'Tipoatributo id' }, { clave: 'valores.valorNumerico', etiqueta: 'Valores · valornumerico' }, { clave: 'orden', etiqueta: 'Orden' }],
  campos: [{ clave: 'tipoAtributoId', etiqueta: 'Tipo de atributo', obligatorio: true, referencia: 'tipos-atributo', soloCrear: true }, { clave: 'nombre', etiqueta: 'Nombre', obligatorio: true }, { clave: 'valores.descripcion', etiqueta: 'Descripción', tipo: 'textarea' }, { clave: 'valores.valorNumerico', etiqueta: 'Valor numérico', tipo: 'decimal' }, { clave: 'valores.unidadMedida', etiqueta: 'Unidad de medida' }, { clave: 'orden', etiqueta: 'Orden', tipo: 'number', obligatorio: true, soloCrear: true }],
  filtro: { clave: 'tipoAtributoId', etiqueta: 'Tipo de atributo', referencia: 'tipos-atributo' },
  listar: atributos_tecnicosApi.listar, obtener: atributos_tecnicosApi.obtener, crear: atributos_tecnicosApi.crear,
  editar: atributos_tecnicosApi.editar, reordenar: atributos_tecnicosApi.reordenar, cambiar: atributos_tecnicosApi.cambiar,
}
export function VistaAtributosTecnicos() { return <ListadoCatalogo config={config} /> }
