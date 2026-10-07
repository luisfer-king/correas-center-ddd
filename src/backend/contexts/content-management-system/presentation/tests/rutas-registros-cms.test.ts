import assert from 'node:assert/strict'
import { test } from 'node:test'
import { servidorCms, lectura, escritura, antes, actor } from './soporte-http-cms.js'
import { entrada } from '../../application/tests/soporte-pruebas-cms.js'

test('HTTP registros-cms', async t => {
  const { app, env } = await servidorCms('registroCMS'); t.after(() => app.close())
  const base = '/api/portal/cms/registros-cms'
  const datosCrear = JSON.parse(JSON.stringify(entrada('RegistroCMS'), (_k, v) => typeof v === 'bigint' ? v.toString() : v))
  const datosEditar = Object.fromEntries(["nombre", "descripcion"].map(clave => [clave, datosCrear[clave]]))

  await t.test('sesión requerida antes de validar cuerpo o acceder a datos', async () => {
    assert.equal((await app.inject({ method: 'GET', url: base })).statusCode, 401)
    assert.equal((await app.inject({ method: 'POST', url: base, payload: {} })).statusCode, 401)
  })
  await t.test('lista y audita lectura autorizada', async () => {
    const n = env.auditorias.length
    const r = await app.inject({ method: 'GET', url: base, headers: lectura })
    assert.equal(r.statusCode, 200, r.body)
    assert.ok(Array.isArray(r.json()))
    assert.equal(env.auditorias.length, n+1)
    assert.ok(env.auditorias.at(-1)?.includes('Lectura'))
    assert.ok(env.auditorias.at(-1)?.includes('prueba-http-cms'))
  })
  await t.test('consulta individual convierte identidad y fecha a JSON', async () => {
    const r = await app.inject({ method: 'GET', url: base+'/2', headers: lectura })
    assert.equal(r.statusCode, 200, r.body)
    assert.equal(r.json().id, '2')
    assert.equal(r.json().actualizadoEn, antes.toISOString())
  })
  await t.test('origen y encabezado de escritura son obligatorios', async () => {
    for (const headers of [lectura, { ...escritura, origin: 'https://otro.example' }, { ...escritura, 'x-portal-request': '0' }]) {
      assert.equal((await app.inject({ method: 'POST', url: base, headers, payload: datosCrear })).statusCode, 403)
    }
  })
  await t.test('rechaza actor del cuerpo y campos no declarados', async () => {
    const r = await app.inject({ method: 'POST', url: base, headers: escritura, payload: { ...datosCrear, actorId: actor } })
    assert.equal(r.statusCode, 400, r.body)
  })
  await t.test('crear devuelve 201 e identifica al actor de sesión en auditoría', async () => {
    const r = await app.inject({ method: 'POST', url: base, headers: escritura, payload: datosCrear })
    assert.equal(r.statusCode, 201, r.body)
    assert.ok(env.auditorias.at(-1)?.includes(actor))
    assert.ok(env.auditorias.at(-1)?.includes('Creación'))
  })
  await t.test('editar exige versión y rechaza versión obsoleta', async () => {
    const missing = await app.inject({ method: 'PATCH', url: base+'/2', headers: escritura, payload: datosEditar })
    assert.equal(missing.statusCode, 400, missing.body)
    const conflict = await app.inject({ method: 'PATCH', url: base+'/2', headers: escritura, payload: { ...datosEditar, version: '2026-01-01T00:00:00.000Z' } })
    assert.equal(conflict.statusCode, 409, conflict.body)
  })
  await t.test('editar devuelve datos y audita dentro de la escritura', async () => {
    const r = await app.inject({ method: 'PATCH', url: base+'/2', headers: escritura, payload: { ...datosEditar, version: env.fila().actualizadoEn.toISOString() } })
    assert.equal(r.statusCode, 200, r.body)
    assert.ok(env.auditorias.at(-1)?.includes('Edición'))
  })
  await t.test('permiso revocado impide lectura y escritura sin auditoría', async () => {
    env.opciones.permiso = false; const n = env.auditorias.length
    assert.equal((await app.inject({ method: 'GET', url: base, headers: lectura })).statusCode, 403)
    assert.equal((await app.inject({ method: 'POST', url: base, headers: escritura, payload: datosCrear })).statusCode, 403)
    assert.equal(env.auditorias.length, n); env.opciones.permiso = true
  })
  await t.test('ID fuera de rango y filtro desconocido se rechazan', async () => {
    assert.equal((await app.inject({ method: 'GET', url: base+'/9999999999999999999', headers: lectura })).statusCode, 400)
    assert.equal((await app.inject({ method: 'GET', url: base+'?extra=1', headers: lectura })).statusCode, 400)
    assert.equal((await app.inject({ method: 'GET', url: base+'?limite=0', headers: lectura })).statusCode, 400)
  })
  await t.test('auditoría de lectura fallida bloquea la respuesta', async () => {
    env.opciones.fallarAuditoria = true
    const r = await app.inject({ method: 'GET', url: base, headers: lectura })
    assert.equal(r.statusCode, 500, r.body); assert.deepEqual(r.json(), { error: 'Error interno' })
    env.opciones.fallarAuditoria = false
  })
})
