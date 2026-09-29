import { marcasApi } from '../api/marcas'
import type { MarcaCatalogo } from '../api/tipos-catalogo'
import type { ConfiguracionCatalogo } from './configuracion-catalogo'
import { ListadoCatalogo } from './listado-catalogo'
const config: ConfiguracionCatalogo<MarcaCatalogo> = {
  recurso: 'marcas', titulo: 'Marcas', descripcion: 'Marcas vinculables a los productos.',
  columnas: [{ clave: 'nombre', etiqueta: 'Nombre' }, { clave: 'slug', etiqueta: 'Slug' }, { clave: 'logo', etiqueta: 'Logo' }, { clave: 'orden', etiqueta: 'Orden' }],
  campos: [{ clave: 'nombre', etiqueta: 'Nombre', obligatorio: true }, { clave: 'slug', etiqueta: 'Slug', obligatorio: true, soloCrear: true, ayuda: 'Identificador de URL; no se puede modificar después de crear.' }, { clave: 'logo', etiqueta: 'URL del logo' }, { clave: 'orden', etiqueta: 'Orden', tipo: 'number', obligatorio: true, soloCrear: true }],
  
  listar: marcasApi.listar, obtener: marcasApi.obtener, crear: marcasApi.crear,
  editar: marcasApi.editar, reordenar: marcasApi.reordenar, cambiar: marcasApi.cambiar,
}
export function VistaMarcas() { return <ListadoCatalogo config={config} /> }
