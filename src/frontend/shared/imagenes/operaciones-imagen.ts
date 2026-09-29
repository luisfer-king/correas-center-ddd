export type PixelesImagen = { width: number; height: number; data: Uint8ClampedArray }
/** Elimina solo el área conectada al píxel elegido; no todos los colores similares de la imagen. */
export function quitarFondoConectado(imagen: PixelesImagen, x: number, y: number, tolerancia: number): void {
  const { width, height, data } = imagen
  if (!Number.isInteger(x) || !Number.isInteger(y) || x < 0 || y < 0 || x >= width || y >= height ||
      !Number.isFinite(tolerancia) || tolerancia < 0 || tolerancia > 160) throw new Error('Selección de fondo inválida.')
  const inicio = y * width + x, offset = inicio * 4
  if (data[offset + 3] === 0) return
  const rojo = data[offset], verde = data[offset + 1], azul = data[offset + 2]
  const vistos = new Uint8Array(width * height), cola = new Int32Array(width * height)
  let cabeza = 0, fin = 0
  cola[fin++] = inicio; vistos[inicio] = 1
  while (cabeza < fin) {
    const indice = cola[cabeza++], i = indice * 4
    const distancia = (data[i] - rojo) ** 2 + (data[i + 1] - verde) ** 2 + (data[i + 2] - azul) ** 2
    if (data[i + 3] === 0 || distancia > tolerancia ** 2) continue
    data[i + 3] = 0
    const agregar = (vecino: number) => { if (!vistos[vecino]) { vistos[vecino] = 1; cola[fin++] = vecino } }
    if (indice % width > 0) agregar(indice - 1)
    if (indice % width < width - 1) agregar(indice + 1)
    if (indice >= width) agregar(indice - width)
    if (indice < width * (height - 1)) agregar(indice + width)
  }
}
export function rectanguloRecorte(width: number, height: number, x: number, y: number, ancho: number, alto: number) {
  if (![width, height, x, y, ancho, alto].every(Number.isFinite) || width < 1 || height < 1 || x < 0 || y < 0 ||
      ancho <= 0 || alto <= 0 || x + ancho > 100 || y + alto > 100) throw new Error('Recorte inválido.')
  const izquierda = Math.min(width - 1, Math.floor(width * x / 100))
  const arriba = Math.min(height - 1, Math.floor(height * y / 100))
  return { x: izquierda, y: arriba, ancho: Math.max(1, Math.min(width - izquierda, Math.round(width * ancho / 100))),
    alto: Math.max(1, Math.min(height - arriba, Math.round(height * alto / 100))) }
}
