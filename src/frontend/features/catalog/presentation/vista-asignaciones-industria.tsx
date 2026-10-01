import { asignaciones_industriaApi } from '../api/asignaciones-industria'
import type { AsignacionIndustriaCatalogo } from '../api/tipos-catalogo'
import type { ConfiguracionCatalogo } from './configuracion-catalogo'
import { ListadoCatalogo } from './listado-catalogo'
const config: ConfiguracionCatalogo<AsignacionIndustriaCatalogo> = {
  recurso: 'asignaciones-industria', titulo: 'Industrias de categorías y servicios', descripcion: 'Relaciona industrias con categorías o servicios.',
  columnas: [{ clave: 'industriaId', etiqueta: 'Industria id' }, { clave: 'destino.tipo', etiqueta: 'Destino · tipo' }, { clave: 'destino.id', etiqueta: 'Destino · id' }, { clave: 'orden', etiqueta: 'Orden' }],
  campos: [{ clave: 'industriaId', etiqueta: 'Industria', obligatorio: true, referencia: 'industrias', soloCrear: true }, { clave: 'destino.tipo', etiqueta: 'Tipo de destino', obligatorio: true, soloCrear: true, opciones: [{ valor: 'categoria', etiqueta: 'Categoría' }, { valor: 'servicio', etiqueta: 'Servicio' }] }, { clave: 'destino.id', etiqueta: 'Categoría o servicio', obligatorio: true, referencia: 'destinos', soloCrear: true }, { clave: 'orden', etiqueta: 'Orden', tipo: 'number', obligatorio: true }],
  filtro: { clave: 'industriaId', etiqueta: 'Industria', referencia: 'industrias', obligatorio: true },
  listar: asignaciones_industriaApi.listar, obtener: asignaciones_industriaApi.obtener, crear: asignaciones_industriaApi.crear,
  editar: asignaciones_industriaApi.editar,  cambiar: asignaciones_industriaApi.cambiar,
}
export function VistaAsignacionesIndustria() { return <ListadoCatalogo config={config} /> }
