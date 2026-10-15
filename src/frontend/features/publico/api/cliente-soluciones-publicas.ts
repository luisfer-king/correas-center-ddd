import { solicitarApi } from '../../../shared/api/cliente-http'
import { consultarIndustriasPublico } from '../../catalog/api/publico/cliente-industrias'
import { consultarServiciosPublico } from '../../catalog/api/publico/cliente-servicios'
import { cargarPublico } from './cache-publica'
import { todasLasPaginas } from './cliente-marco-publico'
import type { DetalleIndustriaPublica, DetalleServicioPublico } from '../../../../shared/publico/catalogo'
export const industriasPublicas=(signal?:AbortSignal)=>cargarPublico('industrias-listado',()=>todasLasPaginas(consultarIndustriasPublico),signal)
export const serviciosPublicos=(signal?:AbortSignal)=>cargarPublico('servicios-listado',()=>todasLasPaginas(consultarServiciosPublico),signal)
export const industriaPublica=(slug:string,signal?:AbortSignal)=>cargarPublico('industria:'+slug,()=>solicitarApi<DetalleIndustriaPublica>('/api/publico/catalogo/industrias/'+encodeURIComponent(slug)),signal)
export const servicioPublico=(slug:string,signal?:AbortSignal)=>cargarPublico('servicio:'+slug,()=>solicitarApi<DetalleServicioPublico>('/api/publico/catalogo/servicios/'+encodeURIComponent(slug)),signal)
