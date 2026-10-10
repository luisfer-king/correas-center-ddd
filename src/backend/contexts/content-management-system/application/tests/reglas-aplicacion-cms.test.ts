import assert from 'node:assert/strict'
import { test } from 'node:test'
import { consultaCms, contextoEscrituraCms, exigirVersionCms } from '../operaciones-cms.js'
import { CatalogoFuentesWizardCms, footerCms } from '../validaciones-cms.js'
import { permitirCms } from '../seguridad-cms.js'
import { menuVisibleCms } from '../proyeccion-menu.js'
import { MenuItem } from '../../domain/menu-item.js'
import { RutaInterna } from '../../domain/cms-values.js'
import { Orden } from '../../../../shared/domain/value-objects.js'
import { entorno, actor, contexto, antes, despues } from './soporte-pruebas-cms.js'

test('consultas: estado eliminado e inclusión de bajas exigen rol super_admin', async () => {
  const env = entorno('TipoSeccion')
  await assert.rejects(consultaCms(env.auth, actor, { estado: 'eliminado' }), /Acceso denegado/)
  await assert.rejects(consultaCms(env.auth, actor, { incluirEliminados: true }), /Acceso denegado/)
  env.opciones.superAdmin = true
  assert.equal((await consultaCms(env.auth, actor, { estado: 'eliminado' })).incluirEliminados, true)
  assert.equal((await consultaCms(env.auth, actor, {})).incluirEliminados, false)
})
test('consultas: rechaza límites, offsets y estados inválidos', async () => {
  const env = entorno('TipoSeccion')
  for (const consulta of [{ limite: 0 }, { limite: 201 }, { desplazamiento: -1 }, { limite: NaN }, { estado: 'publicado' as never }, { incluirEliminados: 'sí' as never }]) {
    await assert.rejects(consultaCms(env.auth, actor, consulta))
  }
})
test('versiones: avanza tras registro y menú aunque reloj tenga la misma hora', () => {
  const env = entorno('MenuItem')
  const escritura = contextoEscrituraCms(contexto, env.reloj, antes, despues)
  assert.equal(escritura.cuando.getTime(), despues.getTime()+1)
  assert.throws(() => exigirVersionCms(antes, null), /modificado/)
  assert.doesNotThrow(() => exigirVersionCms(null, null))
  assert.throws(() => contextoEscrituraCms(contexto, { ahora: () => new Date(NaN) }))
})
test('seguridad: actor inválido no llega al servicio IAM', async () => {
  const env = entorno('TipoSeccion')
  await assert.rejects(permitirCms(env.auth, 'id-del-body', 'tipos_seccion', 'read'), /UUID inválido/)
  assert.equal(env.permisos.length, 0)
})
test('wizard: catálogo explícito rechaza fuente y filtro no registrados', () => {
  const fuentes = new CatalogoFuentesWizardCms({ productos: ['categoria'] })
  assert.doesNotThrow(() => fuentes.validar('productos', null))
  assert.doesNotThrow(() => fuentes.validar('productos', 'categoria'))
  assert.throws(() => fuentes.validar('productos', 'sql'), /no permitido/)
  assert.throws(() => fuentes.validar('tabla_arbitraria', null), /no permitido/)
})
test('footer: valida correspondencia de destino y seguridad del enlace', () => {
  assert.throws(() => footerCms('producto', { tipo: 'servicio', id: 1n }, null), /no corresponde/)
  assert.deepEqual(footerCms('red_social', null, null), {destino:null,enlace:null})
  assert.throws(() => footerCms('red_social', null, 'javascript:alert(1)'))
  assert.throws(() => footerCms('producto', null, '//externo.example'))
})
test('menú: proyección oculta ítems eliminados y conserva el agregado original', () => {
  const env = entorno('Menu'); const menu = env.actual
  const item = new MenuItem({ nombre:'Correas', categoriaId:1n,id: 7n, menuId: menu.id, ruta: RutaInterna.create('/correas'), orden: Orden.create(0), estado: 'eliminado',
    fechas: { creadoEn: antes, actualizadoEn: despues, eliminadoEn: despues } })
  // Reconstruir la fixture con un ítem histórico.
  const agregado = new menu.constructor({ id: menu.id, empresaId: menu.empresaId, grupo: menu.grupo, destino: menu.destino, ruta: menu.ruta,
    icono: menu.icono, mostrar: menu.mostrar, orden: menu.orden, cargarSubmenu: menu.cargarSubmenu, estado: menu.estado,
    fechas: { creadoEn: menu.creadoEn, actualizadoEn: menu.actualizadoEn, eliminadoEn: null }, items: [item] })
  assert.equal(menuVisibleCms(agregado, false).itemsOrdenados.length, 0)
  assert.equal(menuVisibleCms(agregado, true).itemsOrdenados.length, 1)
  assert.equal(agregado.itemsOrdenados.length, 1)
})
