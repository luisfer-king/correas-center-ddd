import assert from 'node:assert/strict'
import { test } from 'node:test'
import { antes, escritura, servidorCms } from './soporte-http-cms.js'
const ruta = '/products/correas/trapezoidales/'
test('subenlace: crear con slug jerárquico no repite el producto', async t => {
    const { app, env } = await servidorCms('menuItem'); t.after(() => app.close())
    env.tablas.producto[0].slug = 'correas'; env.tablas.categoria[0].slug = 'correas/trapezoidales'
    const r = await app.inject({ method: 'POST', url: '/api/portal/cms/items-menu', headers: escritura, payload: { menuId: '1', nombre: 'Trapezoidales', categoriaId: '1' } })
    assert.equal(r.statusCode, 201, r.body); assert.equal(r.json().ruta, ruta)
    assert.equal(env.tablas.menuItem.find(x => x.id === 99n)!.ruta, ruta)
})
for (const estado of ['activo', 'inactivo']) test(`subenlace: editar ${estado} corrige ruta previa sin cambiar categoría ni nombre`, async t => {
    const { app, env } = await servidorCms('menuItem'); t.after(() => app.close())
    env.tablas.producto[0].slug = 'correas'; env.tablas.categoria[0].slug = 'correas/trapezoidales'
    const fila = env.tablas.menuItem.find(x => x.id === 2n)!
    fila.ruta = '/products/correas/correas/trapezoidales/'; fila.estado = estado
    const r = await app.inject({ method: 'PATCH', url: '/api/portal/cms/items-menu/2', headers: escritura, payload: { version: antes.toISOString(), nombre: fila.nombre, categoriaId: '1' } })
    assert.equal(r.statusCode, 200, r.body); assert.equal(r.json().ruta, ruta); assert.equal(r.json().estado, estado)
    assert.equal(env.fila().ruta, ruta); assert.equal(env.fila().categoriaId, 1n)
    assert.ok(env.fila().actualizadoEn > antes)
})
