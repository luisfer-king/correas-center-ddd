import assert from 'node:assert/strict'
import { test } from 'node:test'
import { servidorCms, lectura, escritura, antes } from './soporte-http-cms.js'
import { recursosCms } from '../../application/use-cases/autorizacion/obtener-capacidades-cms.js'

test('CMS: capacidades, OpenAPI y aislamiento de hooks', async t => {
  const { app, env } = await servidorCms(); t.after(() => app.close())
  const r = await app.inject({ method: 'GET', url: '/api/portal/cms/capacidades', headers: lectura })
  assert.equal(r.statusCode, 200, r.body)
  assert.deepEqual(Object.keys(r.json().recursos).sort(), [...recursosCms].sort())
  assert.equal(r.json().verEliminados, false)
  assert.ok(env.auditorias.at(-1)?.includes('portal_cms'))
  assert.equal((await app.inject('/api/health')).statusCode, 200)
  const spec = app.swagger()
  assert.equal(Object.keys(spec.paths ?? {}).filter(p => p.startsWith('/api/portal/cms')).length, 58)
})
test('CMS: sesión inválida produce 401', async t => {
  const { app } = await servidorCms(); t.after(() => app.close())
  const r = await app.inject({ method: 'GET', url: '/api/portal/cms/tipos-seccion', headers: { cookie: 'cc_portal_local=incorrecta' } })
  assert.equal(r.statusCode, 401, r.body)
})
test('CMS: bajas consultables solo por super_admin, sin posibilidad de edición', async t => {
  const { app, env, roles } = await servidorCms(); t.after(() => app.close())
  const fila = env.tablas.tipoSeccion.find(x => x.id === 2n)!
  fila.estado = 'eliminado'; fila.eliminadoEn = antes
  const url = '/api/portal/cms/tipos-seccion/2'
  assert.equal((await app.inject({ method: 'GET', url, headers: lectura })).statusCode, 404)
  assert.equal((await app.inject({ method: 'GET', url: '/api/portal/cms/tipos-seccion?incluirEliminados=true', headers: lectura })).statusCode, 403)
  roles.superAdmin = true
  assert.equal((await app.inject({ method: 'GET', url, headers: lectura })).statusCode, 200)
  assert.equal((await app.inject({ method: 'PATCH', url: url+'/activar', headers: escritura, payload: { version: antes.toISOString() } })).statusCode, 404)
})
test('CMS: revocación tras consulta bloquea respuesta al revalidar lectura', async t => {
  const { app, env, casos } = await servidorCms(); t.after(() => app.close())
  const listar = casos['tipos-seccion'].listar.ejecutar.bind(casos['tipos-seccion'].listar)
  casos['tipos-seccion'].listar.ejecutar = async (...args) => { const filas = await listar(...args); env.opciones.permiso = false; return filas }
  const r = await app.inject({ method: 'GET', url: '/api/portal/cms/tipos-seccion', headers: lectura })
  assert.equal(r.statusCode, 403, r.body)
  assert.equal(env.auditorias.length, 0)
  assert.deepEqual(r.json(), { error: 'Acceso denegado' })
})
test('CMS: errores inesperados no exponen detalles de persistencia', async t => {
  const { app, casos } = await servidorCms(); t.after(() => app.close())
  casos['tipos-seccion'].listar.ejecutar = async () => { throw new Error('Detalle interno de conexión privada') }
  const r = await app.inject({ method: 'GET', url: '/api/portal/cms/tipos-seccion', headers: lectura })
  assert.equal(r.statusCode, 500, r.body)
  assert.deepEqual(r.json(), { error: 'Error interno' })
})
