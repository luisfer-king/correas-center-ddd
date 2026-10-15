// Mantener las rutas guardadas en CMS. Los prefijos históricos siguen disponibles.
export const prefijosPublicos = { productos: '/products', industrias: '/applications', servicios: '/services' } as const
export function rutaProductoPublica(slug:string) { return '/products/'+encodeURIComponent(slug) }
export function rutaCategoriaPublica(productoSlug:string,categoriaSlug:string) {
 const prefijo=productoSlug+'/', sufijo=categoriaSlug.startsWith(prefijo)?categoriaSlug.slice(prefijo.length):categoriaSlug
 return rutaProductoPublica(productoSlug)+'/'+sufijo.split('/').map(encodeURIComponent).join('/')
}
export function slugServicio(nombre: string): string {
 return nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}
export function enlacePublico(valor: unknown, externo = false): string | null {
 if (typeof valor !== 'string' || !valor || /[\\\s\u0000-\u001f]/.test(valor)) return null
 if (valor.startsWith('/') && !valor.startsWith('//')) {
  let decodificado: string
  try { decodificado = decodeURIComponent(valor) } catch { return null }
  if (/[\\\u0000-\u001f]/.test(decodificado) || decodificado.startsWith('//')) return null
  const url = new URL(decodificado, 'https://correas.invalid')
  if (['/api', '/admin', '/portal'].some(p => url.pathname === p || url.pathname.startsWith(p + '/'))) return null
  return valor
 }
 if (externo && /^(https:|mailto:|tel:)/i.test(valor)) {
  try { const u = new URL(valor); return u.username || u.password ? null : valor } catch { return null }
 }
 return null
}
