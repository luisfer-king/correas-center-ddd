import { cargarPublico } from './cache-publica'
import type { ConsultaPaginaPublica, EmpresaPublica, PaginaPublica, SucursalPublica } from '../../../../shared/publico/comun'
import type { ConfiguracionPublica, FooterPublicado, MenuPublicado, SeccionPublicada } from '../../../../shared/publico/cms'
import { consultarEmpresaPublico } from '../../commercial/api/publico/cliente-empresa'
import { consultarConfiguracionPublico } from '../../cms/api/publico/cliente-configuracion'
import { consultarMenusPublico } from '../../cms/api/publico/cliente-menus'
import { consultarFooterPublico } from '../../cms/api/publico/cliente-footer'
import { consultarSeccionesPublico } from '../../cms/api/publico/cliente-secciones'
export interface DatosMarcoPublico { empresa: EmpresaPublica; configuracion: ConfiguracionPublica; menus: MenuPublicado[]; footer: FooterPublicado[]; secciones: SeccionPublicada[]; sucursales?: SucursalPublica[] }
export async function todasLasPaginas<T>(consultar: (p: Partial<ConsultaPaginaPublica>, signal?: AbortSignal) => Promise<PaginaPublica<T>>, signal?: AbortSignal): Promise<T[]> {
 const items: T[] = []
 for (let desplazamiento = 0; desplazamiento <= 10000; desplazamiento += 100) {
  if (signal?.aborted) throw new DOMException('Solicitud cancelada', 'AbortError')
  const pagina = await consultar({ limite: 100, desplazamiento }, signal)
  items.push(...pagina.items)
  if (!pagina.hayMas) return items
 }
 throw new Error('El contenido público supera el límite de consulta.')
}

export async function obtenerMarcoPublico(signal?: AbortSignal, ruta = '/'): Promise<DatosMarcoPublico> {
 const [empresa, configuracion, menus, footer, secciones] = await Promise.all([
  cargarPublico('empresa',()=>consultarEmpresaPublico(),signal), cargarPublico('configuracion',()=>consultarConfiguracionPublico(),signal),
  cargarPublico('menus',()=>todasLasPaginas(consultarMenusPublico),signal), cargarPublico('footer',()=>todasLasPaginas(consultarFooterPublico),signal),
  ruta === '/' ? cargarPublico('secciones',()=>todasLasPaginas(consultarSeccionesPublico),signal) : Promise.resolve([]),
 ])
 return { empresa, configuracion, menus, footer, secciones }
}
