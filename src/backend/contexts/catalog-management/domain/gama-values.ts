import { idCatalogo, textoCatalogo } from './catalog-values.js'
export function idGama(id: bigint): bigint {
  idCatalogo(id)
  if (id > 9223372036854775807n) throw new Error('ID fuera de bigint PostgreSQL')
  return id
}
export function nombreGama(valor: string): string {
  const texto = textoCatalogo(valor, 'Nombre')
  if (texto.length > 255) throw new Error('Nombre demasiado largo')
  return texto
}
export function codigoGama(valor: string): string {
  if (typeof valor !== 'string' || !/^[a-z0-9][a-z0-9_-]{0,79}$/.test(valor)) throw new Error('Código de gama inválido')
  return valor
}
export function ordenGama(valor: number): number {
  if (!Number.isInteger(valor) || valor < 1 || valor > 2147483647) throw new Error('Orden de gama inválido')
  return valor
}
export function siguienteOrdenGama(elementos: readonly { orden: number; estado: string }[]): number {
  return ordenGama(elementos.reduce((max, e) => e.estado === 'eliminado' ? max : Math.max(max, ordenGama(e.orden)), 0) + 1)
}
export function textoOpcionalGama(valor: string | null, maximo?: number): string | null {
  if (valor === null) return null
  if (typeof valor !== 'string' || (maximo !== undefined && valor.length > maximo)) throw new Error('Texto de gama inválido')
  return valor
}
export function enlaceGama(valor: string | null): string | null {
  if (valor === null) return null
  if (typeof valor !== 'string' || !valor || valor.length > 2048 || /[\s\\]/.test(valor)) throw new Error('Enlace de gama inválido')
  if (valor.startsWith('/') && !valor.startsWith('//')) return valor
  try { const url = new URL(valor); if (url.protocol === 'https:' && !url.username && !url.password) return valor } catch { /* Mensaje de dominio */ }
  throw new Error('Enlace de gama inválido')
}
