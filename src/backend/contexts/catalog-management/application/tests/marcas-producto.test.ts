import assert from 'node:assert/strict'
import { test } from 'node:test'
import type { AutorizacionCatalogo } from '../acceso-catalogo.js'
import { GestionarMarcasProducto } from '../use-cases/productos/gestionar-marcas-producto.js'
const auth: AutorizacionCatalogo = { ejecutar: async () => { }, tienePermiso: async () => true, tieneRolActivo: async () => false }
test('marcas de producto: permite altas y bajas múltiples deduplicadas', async () => {
    let recibido: unknown
    const caso = new GestionarMarcasProducto({ actualizar: async (...args) => { recibido = args } }, auth)
    await caso.ejecutar('actor', 1n, [2n, 2n, 3n], [4n, 5n])
    assert.deepEqual(recibido, [1n, [2n, 3n], [4n, 5n], 'actor'])
})
test('marcas de producto: no admite asignar y retirar la misma marca', async () => {
    let escrituras = 0
    const caso = new GestionarMarcasProducto({ actualizar: async () => { escrituras++ } }, auth)
    await assert.rejects(caso.ejecutar('actor', 1n, [2n], [2n]), /Solicitud inválida/)
    assert.equal(escrituras, 0)
})
test('marcas de producto: exige autorización antes de escribir', async () => {
    let escrituras = 0
    const caso = new GestionarMarcasProducto({ actualizar: async () => { escrituras++ } }, { ...auth, ejecutar: async () => { throw new Error('Acceso denegado') } })
    await assert.rejects(caso.ejecutar('actor', 1n, [2n], []), /Acceso denegado/)
    assert.equal(escrituras, 0)
})
