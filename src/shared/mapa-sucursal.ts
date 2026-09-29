/** Se conserva únicamente un src HTTPS permitido, nunca HTML suministrado. */
export function interpretarMapaSucursal(entrada: string | null): {
    url: string | null; latitud: string | null; longitud: string | null
} {
    let texto = (entrada ?? '').trim()
    if (!texto) return { url: null, latitud: null, longitud: null }
    if (texto.startsWith('<')) {
        const iframe = texto.match(/^<iframe\b[^>]*\bsrc\s*=\s*(["'])(.*?)\1[^>]*>(?:\s*<\/iframe>)?\s*$/is)
        if (!iframe) throw new Error('Pega el enlace src o el iframe de Google Maps.')
        texto = iframe[2].replace(/&amp;/g, '&')
    }
    let url: URL
    try { url = new URL(texto) } catch { throw new Error('El enlace del mapa no es válido.') }
    if (url.protocol !== 'https:' || url.username || url.password || url.port ||
        !['www.google.com', 'maps.google.com', 'www.google.com.bo'].includes(url.hostname) ||
        !(url.pathname === '/maps/embed' || url.pathname.startsWith('/maps/embed/') ||
            (url.pathname === '/maps' && url.searchParams.get('output') === 'embed'))) {
        throw new Error('Utiliza un enlace HTTPS de inserción de Google Maps (Compartir → Insertar un mapa).')
    }
    const numero = '(-?\\d+(?:\\.\\d+)?)'
    const pb = url.searchParams.get('pb') ?? ''
    const posicion = pb.match(new RegExp('!2d' + numero + '!3d' + numero))
    let lat: string | undefined, lng: string | undefined
    if (posicion) { lng = posicion[1]; lat = posicion[2] }
    else {
        for (const clave of ['q', 'query', 'center', 'll']) {
            const par = (url.searchParams.get(clave) ?? '').match(new RegExp('^\\s*' + numero + '\\s*,\\s*' + numero + '\\s*$'))
            if (par) { lat = par[1]; lng = par[2]; break }
        }
    }
    if (lat === undefined || lng === undefined)
        throw new Error('El enlace no contiene coordenadas legibles. Copia el iframe desde Google Maps → Compartir → Insertar un mapa.')
    if (!Number.isFinite(Number(lat)) || !Number.isFinite(Number(lng)) || Math.abs(Number(lat)) > 90 || Math.abs(Number(lng)) > 180)
        throw new Error('Las coordenadas del mapa están fuera de rango.')
    return { url: url.href, latitud: lat, longitud: lng }
}
