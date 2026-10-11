/** Las subidas propias son rutas del mismo origen; no dependen del puerto de Vite. */
export function urlImagen(valor: unknown): string {
  if (typeof valor !== 'string') return ''
  const texto = valor.trim()
  if (!texto || /[\\\u0000-\u001f\u007f]/.test(texto)) return ''
  if (/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(texto)) return texto
  if (texto.startsWith('/') && !texto.startsWith('//')) return texto
  try {
    const url = new URL(texto)
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return ''
    const local = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)
    const archivo = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}'
    const propia = new RegExp(`^/api/public/(?:(?:catalogo|cms)/imagenes/[a-z-]+/${archivo}\\.png|crm/logos/${archivo}\\.(?:png|jpg|webp))$`, 'i')
    // Compatibilidad con registros creados antes de cambiar localhost:5173 a :3000.
    // Las imágenes de proveedores externos conservan su origen.
    return local && propia.test(url.pathname) ? url.pathname + url.search : url.href
  } catch { return '' }
}
