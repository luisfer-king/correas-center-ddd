import assert from 'node:assert/strict'
import { test } from 'node:test'
import { cargarPaginasCrm } from '../../src/frontend/features/commercial/api/cargar-paginas-crm.ts'

test('carga registros de páginas posteriores y no duplica IDs', async () => {
    const llamadas: number[] = []
    const filas = await cargarPaginasCrm(async (pagina) => {
        llamadas.push(pagina)
        return pagina === 1 ? Array.from({ length: 100 }, (_, i) => ({ id: String(i) })) : [{ id: '99' }, { id: '100' }]
    }, new AbortController().signal)
    assert.deepEqual(llamadas, [1, 2]); assert.equal(filas.length, 101)
    assert.equal(filas.at(-1)?.id, '100')
})
test('sin registros devuelve un selector vacío', async () => {
    assert.deepEqual(await cargarPaginasCrm(async () => [], new AbortController().signal), [])
})
test('error en una página no se presenta como listado completo o vacío', async () => {
    await assert.rejects(cargarPaginasCrm(async (pagina) => {
        if (pagina === 2) throw new Error('Sin permiso')
        return Array.from({ length: 100 }, (_, i) => ({ id: String(i) }))
    }, new AbortController().signal), /Sin permiso/)
})
test('cancelación detiene nuevas consultas', async () => {
    const control = new AbortController(); control.abort()
    let llamadas = 0
    await assert.rejects(cargarPaginasCrm(async () => { llamadas++; return [] }, control.signal))
    assert.equal(llamadas, 0)
})
