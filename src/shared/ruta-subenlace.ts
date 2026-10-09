/** Une rutas por segmentos: la categoría puede incluir ya el slug del padre. */
export function construirRutaSubenlace(base: string, slugCategoria: string): string {
    function segmentos(valor: string): string[] {
        const limpio = valor.trim().replace(/^\/+|\/+$/g, '')
        if (!limpio || /[\\\s?#]/.test(limpio)) throw new Error('Ruta de subenlace inválida')
        const partes = limpio.split('/')
        if (partes.some(p => !p || p === '.' || p === '..')) throw new Error('Ruta de subenlace inválida')
        return partes
    }
    const padre = segmentos(base), categoria = segmentos(slugCategoria)
    let comunes = 0
    for (let cantidad = Math.min(padre.length, categoria.length); cantidad > 0; cantidad--) {
        if (padre.slice(-cantidad).every((p, i) => p === categoria[i])) { comunes = cantidad; break }
    }
    return '/' + [...padre, ...categoria.slice(comunes)].join('/') + '/'
}
