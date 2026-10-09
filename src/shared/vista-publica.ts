export type GrupoPublico = 'Producto' | 'Aplicacion' | 'Servicio'
export interface EnlacePublico { id: string; nombre: string; ruta: string; orden: number }
export interface MenuPublico extends EnlacePublico { grupo: GrupoPublico; icono: string | null; items: EnlacePublico[] }
export interface SeccionPublica { id: string; tipo: string; titulo: string | null; subtitulo: string | null; descripcion: string | null; imagen: string | null; metadata: Record<string, unknown>; orden: number }
export interface VistaPublica { empresa: { id: string; nombre: string; logo: string | null }; menus: Record<GrupoPublico, MenuPublico[]>; secciones: SeccionPublica[] }
export function rutaPublica(valor: unknown): string | null {
 if (typeof valor !== 'string' || !valor.startsWith('/') || valor.startsWith('//') || /[\\\s\u0000-\u001f]/.test(valor)) return null
 return valor
}
export function nombreRuta(ruta: string): string {
 const parte = ruta.split('/').filter(Boolean).at(-1) ?? ''
 let nombre = parte
 try { nombre = decodeURIComponent(parte) } catch { /* conservar ruta */ }
 return nombre.replace(/-/g, ' ').replace(/^./, c => c.toUpperCase())
}
