import type { CapacidadesCms } from '../api/modelos-cms'
import { gruposNavegacionCms } from './navegacion-cms'
export function gruposPortalCms(capacidades?: CapacidadesCms) {
 if (!capacidades) return []
 const enlaces = gruposNavegacionCms.flatMap(g=>g.enlaces).filter(e=>capacidades.recursos[e.recurso].leer).map(e=>({etiqueta:e.titulo,ruta:`/portal/cms/${e.ruta}`}))
 return enlaces.length ? [{id:'cms',titulo:'CMS',enlaces}] : []
}
