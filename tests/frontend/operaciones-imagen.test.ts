import assert from 'node:assert/strict'
import { test } from 'node:test'
import { quitarFondoConectado, rectanguloRecorte } from '../../src/frontend/shared/imagenes/operaciones-imagen.js'

test('quita solo el fondo conectado, preserva el producto y una región blanca aislada', () => {
    const data = new Uint8ClampedArray([255, 255, 255, 255, 0, 0, 0, 255, 255, 255, 255, 255])
    quitarFondoConectado({ width: 3, height: 1, data }, 0, 0, 35)
    assert.equal(data[3], 0); assert.equal(data[7], 255); assert.equal(data[11], 255)
})
test('la tolerancia incluye colores cercanos sin eliminar colores distintos', () => {
    const data = new Uint8ClampedArray([255, 255, 255, 255, 250, 250, 250, 255, 200, 200, 200, 255])
    quitarFondoConectado({ width: 3, height: 1, data }, 0, 0, 10)
    assert.equal(data[7], 0); assert.equal(data[11], 255)
})
test('recorte transforma porcentajes a píxeles sin desbordarse', () => {
    assert.deepEqual(rectanguloRecorte(800, 400, 25, 10, 50, 70), { x: 200, y: 40, ancho: 400, alto: 280 })
    assert.deepEqual(rectanguloRecorte(1, 1, 99, 99, 1, 1), { x: 0, y: 0, ancho: 1, alto: 1 })
    assert.throws(() => rectanguloRecorte(800, 400, 90, 0, 20, 100))
})
test('selecciones fuera de imagen se rechazan', () => {
    assert.throws(() => quitarFondoConectado({ width: 1, height: 1, data: new Uint8ClampedArray(4) }, 2, 0, 0))
})
