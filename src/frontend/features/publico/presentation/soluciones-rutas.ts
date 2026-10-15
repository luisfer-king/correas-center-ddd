import type { MenuPublicado } from '../../../../shared/publico/cms'
import { normalizarRutaPublica } from './datos-marco-publico'
export function esRutaSoluciones(ruta:string,menus:MenuPublicado[]) { return /^\/(applications|services)(?:\/[^/]+)?$/.test(ruta)||menus.some(m=>['industria','servicio'].includes(m.tipoRegistro)&&normalizarRutaPublica(m.ruta)===ruta) }
