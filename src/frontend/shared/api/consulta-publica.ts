import type { ConsultaPaginaPublica } from '../../../shared/publico/comun.js'
export function consultaPublica(p: Partial<ConsultaPaginaPublica>): string {
 const q = new URLSearchParams()
 for (const clave of ['limite', 'desplazamiento', 'q', 'slug', 'productoSlug'] as const) if (p[clave] !== undefined) q.set(clave, String(p[clave]))
 return q.size ? '?' + q.toString() : ''
}
