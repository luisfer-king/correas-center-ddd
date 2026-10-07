import assert from 'node:assert/strict'
import { test } from 'node:test'
import { servidorCms, lectura, escritura, antes } from './soporte-http-cms.js'
test('HTTP metadata de sección', async t => {
  const { app, env } = await servidorCms('contenidoSeccion'); t.after(() => app.close())
  const url = '/api/portal/cms/contenidos-seccion/2/metadata'
  await t.test('requiere sesión y permiso específico', async () => {
    assert.equal((await app.inject({ method: 'GET', url })).statusCode, 401)
    env.opciones.permiso = false
    assert.equal((await app.inject({ method: 'GET', url, headers: lectura })).statusCode, 403)
    env.opciones.permiso = true
  })
  await t.test('lee proyección y audita la sección', async () => {
    const r = await app.inject({ method: 'GET', url, headers: lectura })
    assert.equal(r.statusCode, 200, r.body)
    assert.equal(r.json().contenidoSeccionId, '2')
    assert.equal(r.json().actualizadoEn, antes.toISOString())
    assert.ok(env.auditorias.at(-1)?.includes('contenido_seccion'))
  })
  await t.test('rechaza claves no declaradas, arrays y fechas normalizadas', async () => {
    for (const payload of [ { version: antes.toISOString(), metadata: { desconocida: true } },
      { version: antes.toISOString(), metadata: [] }, { version: '2026-02-30T00:00:00.000Z', metadata: {} } ]) {
      const r = await app.inject({ method: 'PUT', url, headers: escritura, payload })
      assert.equal(r.statusCode, 400, r.body)
    }
  })
  await t.test('reemplaza usando la misma fila y versión de sección', async () => {
    const r = await app.inject({ method: 'PUT', url, headers: escritura, payload: { version: antes.toISOString(), metadata: { cta: 'Consultar' } } })
    assert.equal(r.statusCode, 200, r.body)
    assert.deepEqual(r.json().metadata, { cta: 'Consultar' })
    assert.equal(env.tablas.contenidoSeccion.length, 1)
  })
  await t.test('reutilizar versión produce conflicto', async () => {
    const r = await app.inject({ method: 'PUT', url, headers: escritura, payload: { version: antes.toISOString(), metadata: {} } })
    assert.equal(r.statusCode, 409, r.body)
  })
})
