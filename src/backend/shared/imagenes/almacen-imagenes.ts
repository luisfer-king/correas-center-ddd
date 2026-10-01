import { randomUUID } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import sharp from 'sharp'

export const MAX_BYTES_IMAGEN = 8 * 1024 * 1024
export class ImagenInvalida extends Error {}
export async function normalizarImagen(base64: string): Promise<Buffer> {
  if (!base64 || base64.length > Math.ceil(MAX_BYTES_IMAGEN / 3) * 4)
    throw new ImagenInvalida('La imagen debe ocupar hasta 8 MB.')
  const datos = Buffer.from(base64, 'base64')
  if (datos.toString('base64') !== base64) throw new ImagenInvalida('Contenido base64 inválido.')
  if (datos.length > MAX_BYTES_IMAGEN) throw new ImagenInvalida('La imagen supera 8 MB.')
  try {
    const imagen = sharp(datos, { limitInputPixels: 24000000, failOn: 'error' })
    const meta = await imagen.metadata()
    if (!['png', 'jpeg', 'webp'].includes(meta.format ?? '') || (meta.pages ?? 1) !== 1)
      throw new ImagenInvalida('Utiliza una imagen estática PNG, JPG o WebP.')
    const salida = await imagen.rotate().resize({ width: 4096, height: 4096, fit: 'inside', withoutEnlargement: true })
      .png().toBuffer()
    if (salida.length > MAX_BYTES_IMAGEN) throw new ImagenInvalida('Reduce la resolución de la imagen: el resultado supera 8 MB.')
    return salida
  } catch (error) {
    if (error instanceof ImagenInvalida) throw error
    throw new ImagenInvalida('No se pudo decodificar la imagen. Usa PNG, JPG o WebP de hasta 24 megapíxeles.')
  }
}
export class AlmacenImagenes {
  constructor(private readonly directorio: string, private readonly carpetas: readonly string[]) {}
  private carpeta(recurso: string) {
    if (!this.carpetas.includes(recurso) || !/^[a-z-]+$/.test(recurso)) throw new ImagenInvalida('Elemento no permitido.')
    return resolve(this.directorio, recurso)
  }
  async guardar(recurso: string, base64: string) {
    const carpeta = this.carpeta(recurso)
    const datos = await normalizarImagen(base64)
    await mkdir(carpeta, { recursive: true })
    const nombre = `${randomUUID()}.png`
    await writeFile(resolve(carpeta, nombre), datos, { flag: 'wx' })
    return nombre
  }
  async leer(recurso: string, nombre: string) {
    const carpeta = this.carpeta(recurso)
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.png$/.test(nombre))
      throw new ImagenInvalida('Nombre inválido.')
    return readFile(resolve(carpeta, nombre))
  }
}
