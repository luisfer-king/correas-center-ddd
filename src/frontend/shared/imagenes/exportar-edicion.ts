import { rectanguloRecorte } from './operaciones-imagen';
/** Exporta los píxeles actuales, incluidos fondo eliminado y recorte pendiente. Nunca usa el File original. */
export async function exportarEdicion(canvas: HTMLCanvasElement, recorte: { x: number; y: number; ancho: number; alto: number }): Promise<Blob> {
    const r = rectanguloRecorte(canvas.width, canvas.height, recorte.x, recorte.y, recorte.ancho, recorte.alto)
    const salida = document.createElement('canvas'); salida.width = r.ancho; salida.height = r.alto
    const ctx = salida.getContext('2d')
    if (!ctx) throw new Error('No se pudo exportar la edición.')
    ctx.drawImage(canvas, r.x, r.y, r.ancho, r.alto, 0, 0, r.ancho, r.alto)
    return new Promise((resolve, reject) => salida.toBlob(blob => blob ? resolve(blob) : reject(new Error('No se pudo exportar la edición.')), 'image/png'))
}
export async function imagenBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const lector = new FileReader()
        lector.onload = () => resolve(String(lector.result).split(',')[1])
        lector.onerror = () => reject(new Error('No se pudo leer la imagen editada.'))
        lector.readAsDataURL(blob)
    })
}
