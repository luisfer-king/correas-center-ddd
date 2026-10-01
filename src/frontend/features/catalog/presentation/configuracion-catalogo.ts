import type { BaseCatalogo, FiltroCatalogo, RecursoCatalogo } from '../api/tipos-catalogo'
export type Referencia = 'empresas' | RecursoCatalogo | 'destinos'
export interface CampoCatalogo {
  clave: string
  etiqueta: string
  tipo?: 'text' | 'textarea' | 'number' | 'number-nullable' | 'decimal' | 'checkbox' | 'select'
  obligatorio?: boolean
  referencia?: Referencia
  opciones?: readonly { valor: string; etiqueta: string }[]
  soloCrear?: boolean
  ayuda?: string
}
export interface ConfiguracionCatalogo<T extends BaseCatalogo> {
  recurso: RecursoCatalogo
  titulo: string
  descripcion: string
  columnas: readonly { clave: string; etiqueta: string }[]
  campos: readonly CampoCatalogo[]
  filtro?: { clave: keyof FiltroCatalogo; etiqueta: string; referencia: Referencia; obligatorio?: boolean }
  listar: (pagina: number, filtros: FiltroCatalogo, opciones?: { signal?: AbortSignal }) => Promise<T[]>
  obtener: (id: string, opciones?: { signal?: AbortSignal }) => Promise<T>
  crear: (datos: unknown) => Promise<T>
  editar: (id: string, datos: unknown) => Promise<T>
  reordenar?: (id: string, orden: number) => Promise<T>
  cambiar: (id: string, accion: 'activar' | 'inactivar' | 'eliminar') => Promise<{ ok: boolean }>
}
export function valorCampo(datos: unknown, ruta: string): unknown {
  return ruta.split('.').reduce<unknown>((actual, clave) =>
    actual && typeof actual === 'object' ? (actual as Record<string, unknown>)[clave] : undefined, datos)
}
export function presentarValor(valor: unknown): string {
  if (valor === null || valor === undefined || valor === '') return '—'
  if (typeof valor === 'boolean') return valor ? 'Sí' : 'No'
  if (typeof valor === 'object') return JSON.stringify(valor)
  return String(valor)
}
export function cuerpoFormulario(campos: readonly CampoCatalogo[], datos: Record<string, unknown>, edicion: boolean): Record<string, unknown> {
  const cuerpo: Record<string, unknown> = {}
  for (const campo of campos.filter(c => !edicion || !c.soloCrear)) {
    let valor = datos[campo.clave]
    if (campo.tipo === 'number') valor = Number(valor)
    else if (campo.tipo === 'number-nullable') valor = valor === '' || valor === null ? null : Number(valor)
    else if (campo.tipo === 'checkbox') valor = Boolean(valor)
    else if (typeof valor === 'string') valor = valor.trim() || (campo.obligatorio ? '' : null)
    const partes = campo.clave.split('.')
    let destino = cuerpo
    for (const parte of partes.slice(0, -1)) {
      destino[parte] ??= {}
      destino = destino[parte] as Record<string, unknown>
    }
    destino[partes.at(-1)!] = valor
  }
  return cuerpo
}
