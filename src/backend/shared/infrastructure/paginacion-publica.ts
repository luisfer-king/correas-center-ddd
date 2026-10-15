import type { ConsultaPaginaPublica, PaginaPublica } from '../../../shared/publico/comun.js'
export const publicable = { estado: 'activo' as const, eliminadoEn: null }
export const ordenPublico = [{ orden: 'asc' as const }, { id: 'asc' as const }]
export function paginar<T>(items: T[], p: ConsultaPaginaPublica): PaginaPublica<T> {
 return { items: items.slice(0, p.limite), limite: p.limite, desplazamiento: p.desplazamiento, hayMas: items.length > p.limite }
}
export function nombreBuscado(q?: string) { return q ? { nombre: { contains: q, mode: 'insensitive' as const } } : {} }
