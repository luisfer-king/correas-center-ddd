import { solicitarApi } from '../../../shared/api/cliente-http'
import type { ConsultaCms, RegistroBaseCms, VersionCms } from './modelos-cms'
export function idRutaCms(id: string | number, configuracion = false): string {
 if (typeof id === 'number' && !Number.isSafeInteger(id)) throw new Error('Identificador numérico impreciso; usa un string')
 const texto = String(id)
 if (!/^[1-9][0-9]{0,18}$/.test(texto) || BigInt(texto) > (configuracion ? 2147483647n : 9223372036854775807n)) throw new Error('Identificador inválido')
 return texto
}
export function validarVersionCms(version: VersionCms, nullable = false): VersionCms {
 if (version === null && nullable) return null
 if (typeof version !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(version) || !Number.isFinite(Date.parse(version)) || new Date(version).toISOString() !== version) throw new Error('Versión inválida; vuelve a cargar el registro')
 return version
}
export function clienteRecursoCms<T extends RegistroBaseCms, C, E>(recurso: string, configuracion = false) {
 const acciones = configuracion ? ['actividad'] : ['activar','inactivar','eliminar','reordenar', ...(['contenidos-seccion','menus','elementos-footer'].includes(recurso) ? ['visibilidad'] : []), ...(recurso === 'tipos-seccion' ? ['claves'] : [])]
 const base = `/api/portal/cms/${recurso}`
 const ruta = (id: string | number) => `${base}/${idRutaCms(id, configuracion)}`
 const cuerpoVersion = (version: VersionCms, datos: object) => ({ ...datos, version: validarVersionCms(version, configuracion) })
 return {
  listar: (consulta: ConsultaCms = {}, signal?: AbortSignal) => {
   const query = new URLSearchParams()
   for (const [k,v] of Object.entries(consulta)) if (v !== undefined) query.set(k,String(v))
   return solicitarApi<T[]>(`${base}${query.size ? `?${query}` : ''}`, { signal })
  },
  obtener: (id: string | number, signal?: AbortSignal) => solicitarApi<T>(ruta(id), { signal }),
  crear: (datos: C) => solicitarApi<T>(base, { metodo: 'POST', cuerpo: datos }),
  editar: (id: string | number, version: VersionCms, datos: E) => solicitarApi<T>(ruta(id), { metodo: 'PATCH', cuerpo: cuerpoVersion(version, datos as object) }),
  accion: (id: string | number, version: VersionCms, accion: string, datos: object = {}) => {
   if (!acciones.includes(accion)) throw new Error('Operación CMS inválida')
   return solicitarApi<T>(`${ruta(id)}/${accion}`, { metodo: 'PATCH', cuerpo: cuerpoVersion(version, datos) })
  },
 }
}
