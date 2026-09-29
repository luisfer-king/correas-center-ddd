import { serviciosApi } from '../api/servicios'
import type { ServicioCatalogo } from '../api/tipos-catalogo'
import type { ConfiguracionCatalogo } from './configuracion-catalogo'
import { ListadoCatalogo } from './listado-catalogo'
const config: ConfiguracionCatalogo<ServicioCatalogo> = {
  recurso: 'servicios', titulo: 'Servicios', descripcion: 'Servicios ofrecidos por cada empresa.',
  columnas: [{ clave: 'nombre', etiqueta: 'Nombre' }, { clave: 'empresaId', etiqueta: 'Empresa id' }, { clave: 'descripcion', etiqueta: 'Descripcion' }, { clave: 'orden', etiqueta: 'Orden' }],
  campos: [{ clave: 'empresaId', etiqueta: 'Empresa', obligatorio: true, referencia: 'empresas', soloCrear: true }, { clave: 'nombre', etiqueta: 'Nombre', obligatorio: true }, { clave: 'descripcion', etiqueta: 'Descripción', tipo: 'textarea' }, { clave: 'imagen', etiqueta: 'URL de imagen' }, { clave: 'orden', etiqueta: 'Orden', tipo: 'number', obligatorio: true, soloCrear: true }],
  filtro: { clave: 'empresaId', etiqueta: 'Empresa', referencia: 'empresas' },
  listar: serviciosApi.listar, obtener: serviciosApi.obtener, crear: serviciosApi.crear,
  editar: serviciosApi.editar, reordenar: serviciosApi.reordenar, cambiar: serviciosApi.cambiar,
}
export function VistaServicios() { return <ListadoCatalogo config={config} /> }
