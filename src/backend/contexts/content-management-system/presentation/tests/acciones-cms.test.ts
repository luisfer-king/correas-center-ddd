import assert from 'node:assert/strict'
import { test } from 'node:test'
import { servidorCms, escritura } from './soporte-http-cms.js'
const recursos = [
  ['tipos-seccion','tipoSeccion'], ['contenidos-seccion','contenidoSeccion'], ['menus','menu'], ['items-menu','menuItem'],
  ['elementos-footer','footerElemento'], ['pasos-wizard','pasoWizard'], ['registros-cms','registroCMS'], ['contenidos-registro','contenidoRegistro'],
] as const
for (const [recurso, modelo] of recursos) test(`HTTP acciones ${recurso}`, async t => {
  const { app, env } = await servidorCms(modelo); t.after(() => app.close())
  const base = `/api/portal/cms/${recurso}/2`
  async function cambiar(accion: string, datos = {}) {
    const version = env.fila().actualizadoEn.toISOString()
    const r = await app.inject({ method: 'PATCH', url: `${base}/${accion}`, headers: escritura, payload: { version, ...datos } })
    assert.equal(r.statusCode, 200, r.body)
    return r.json()
  }
  await t.test('reordenar', async () => assert.equal((await cambiar('reordenar', { orden: 4 })).orden, 4))
  if (['contenidos-seccion','menus','elementos-footer'].includes(recurso)) {
    await t.test('visibilidad', async () => assert.equal((await cambiar('visibilidad', { mostrar: false })).mostrar, false))
  }
  if (recurso === 'tipos-seccion') {
    await t.test('claves', async () => assert.deepEqual((await cambiar('claves', { claves: ['cta','extra'] })).camposMetadata, ['cta','extra']))
  }
  await t.test('inactivar', async () => assert.equal((await cambiar('inactivar')).estado, 'inactivo'))
  await t.test('activar', async () => assert.equal((await cambiar('activar')).estado, 'activo'))
  await t.test('eliminar lógicamente', async () => {
    const r = await cambiar('eliminar'); assert.equal(r.estado, 'eliminado'); assert.equal(r.eliminadoEn, r.actualizadoEn)
    assert.equal(env.tablas[modelo].filter(x => x.id === 2n).length, 1)
  })
})
test('HTTP configuración: actividad y filtros nullable', async t => {
  const { app, env } = await servidorCms('configuracionSitio'); t.after(() => app.close())
  const base = '/api/portal/cms/configuracion-sitio'
  let r = await app.inject({ method: 'GET', url: base+'?empresaId=global&activo=sin-definir', headers: escritura })
  assert.equal(r.statusCode, 200, r.body); assert.equal(r.json().length, 1)
  env.tablas.configuracionSitio[0].actualizadoEn = null
  r = await app.inject({ method: 'PATCH', url: base+'/2/actividad', headers: escritura, payload: { version: null, activo: true } })
  assert.equal(r.statusCode, 200, r.body); assert.equal(r.json().activo, true)
})
