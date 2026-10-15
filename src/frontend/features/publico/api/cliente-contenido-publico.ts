import { consultarProductosPublico } from '../../catalog/api/publico/cliente-productos'
import { consultarMarcasPublico } from '../../catalog/api/publico/cliente-marcas'
import { consultarIndustriasPublico } from '../../catalog/api/publico/cliente-industrias'
import { consultarServiciosPublico } from '../../catalog/api/publico/cliente-servicios'
import { consultarSucursalesPublico } from '../../commercial/api/publico/cliente-sucursales'
import { consultarRegistrosPublico } from '../../cms/api/publico/cliente-registros'
import { cargarPublico } from './cache-publica'
import { todasLasPaginas } from './cliente-marco-publico'
// Consultas independientes: no descargar el catálogo completo en Inicio ni contenido institucional en otras rutas.
export const productosInicio = (signal?:AbortSignal)=>cargarPublico('productos-inicio',()=>consultarProductosPublico({limite:8}).then(p=>p.items),signal)
export const marcasInicio = (signal?:AbortSignal)=>cargarPublico('marcas-inicio',()=>todasLasPaginas(consultarMarcasPublico),signal)
export const industriasInicio = (signal?:AbortSignal)=>cargarPublico('industrias-inicio',()=>consultarIndustriasPublico({limite:8}).then(p=>p.items),signal)
export const serviciosInicio = (signal?:AbortSignal)=>cargarPublico('servicios-inicio',()=>consultarServiciosPublico({limite:8}).then(p=>p.items),signal)
export const sucursalesPublicas = (signal?:AbortSignal)=>cargarPublico('sucursales',()=>todasLasPaginas(consultarSucursalesPublico),signal)
export const registrosInstitucionales = (signal?:AbortSignal)=>cargarPublico('registros',()=>todasLasPaginas(consultarRegistrosPublico),signal)
