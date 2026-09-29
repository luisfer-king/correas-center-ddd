import type { BaseCrm } from '../api/tipos-crm'

export type CampoCrm = { clave: string; etiqueta: string; tipo?: 'email' | 'number' | 'textarea' | 'checkbox' | 'uuid';
  obligatorio?: boolean; soloCrear?: boolean; ayuda?: string }
export type AccionCrm<A extends string> = { valor: A; etiqueta: string; estados: readonly string[] }
export type ConfiguracionCrm<T extends BaseCrm, A extends string> = {
  recurso: string; titulo: string; descripcion: string
  columnas: readonly { clave: keyof T & string; titulo: string }[]
  campos: readonly CampoCrm[]; acciones: readonly AccionCrm<A>[]
  editar?: (id: string, datos: Record<string, unknown>) => Promise<T>
  crear: (datos: Record<string, unknown>) => Promise<T>
  listar: (pagina: number, opciones?: { signal?: AbortSignal }) => Promise<T[]>
  obtener: (id: string, opciones?: { signal?: AbortSignal }) => Promise<T>
  cambiar: (id: string, accion: A) => Promise<{ ok: boolean }>
}

export function mostrarCrm(valor: unknown, clave: string): string {
  if (valor == null || valor === '') return '—'
  if (typeof valor === 'boolean') return valor ? 'Sí' : 'No'
  if (typeof valor === 'string' && /En$/.test(clave) && !Number.isNaN(Date.parse(valor)))
    return new Date(valor).toLocaleString('es-BO')
  return String(valor)
}
