import { codigosPermisoCms } from '../permisos-cms.js'
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { entorno, entrada, contexto, actor, antes, despues } from './soporte-pruebas-cms.js'
import type { RepositorioItemsMenu } from '../ports/repositorio-menu-item.js'
import { ActivarMenuItem } from '../use-cases/items-menu/activar-menu-item.js'
import { CrearMenuItem } from '../use-cases/items-menu/crear-menu-item.js'
import { EditarMenuItem } from '../use-cases/items-menu/editar-menu-item.js'
import { EliminarMenuItem } from '../use-cases/items-menu/eliminar-menu-item.js'
import { InactivarMenuItem } from '../use-cases/items-menu/inactivar-menu-item.js'
import { ListarItemsMenu } from '../use-cases/items-menu/listar-items-menu.js'
import { ObtenerMenuItem } from '../use-cases/items-menu/obtener-menu-item.js'
import { ReordenarMenuItem } from '../use-cases/items-menu/reordenar-menu-item.js'

test('ActivarMenuItem: autoriza antes de consultar o escribir', async () => {
  const env = entorno('MenuItem'); env.opciones.permitir = false; const caso = new ActivarMenuItem(env.repo as unknown as RepositorioItemsMenu, env.auth, env.reloj, env.menus as unknown as ConstructorParameters<typeof ActivarMenuItem>[3])
  await assert.rejects(caso.ejecutar(contexto, 2n, antes), /Acceso denegado/)
  assert.equal(env.llamadas.length, 0)
  assert.deepEqual(env.permisos, [...codigosPermisoCms('items_menu', 'manage')])
})

test('ActivarMenuItem: aplica operación y conserva contexto/versión', async () => {
  const env = entorno('MenuItem'); env.actual.inactivar(antes); const caso = new ActivarMenuItem(env.repo as unknown as RepositorioItemsMenu, env.auth, env.reloj, env.menus as unknown as ConstructorParameters<typeof ActivarMenuItem>[3])
  const resultado = await caso.ejecutar(contexto, 2n, antes)
  assert.equal(resultado.id, env.actual.id)
  const guardado = env.llamadas.find(x => x.operacion === 'guardar')!
  assert.equal(guardado.args[1].getTime(), antes.getTime())
  assert.equal(guardado.args[2].ipAddress, contexto.ipAddress)
  assert.equal(guardado.args[2].userAgent, contexto.userAgent)
  assert.ok(guardado.args[2].cuando > antes)
  assert.equal(resultado.estado, 'activo')
})

test('CrearMenuItem: autoriza antes de consultar o escribir', async () => {
  const env = entorno('MenuItem'); env.opciones.permitir = false; const caso = new CrearMenuItem(env.repo as unknown as RepositorioItemsMenu, env.auth, env.reloj, env.menus as unknown as ConstructorParameters<typeof CrearMenuItem>[3])
  await assert.rejects(caso.ejecutar(contexto, entrada('MenuItem')), /Acceso denegado/)
  assert.equal(env.llamadas.length, 0)
  assert.deepEqual(env.permisos, [...codigosPermisoCms('items_menu', 'manage')])
})

test('CrearMenuItem: aplica operación y conserva contexto/versión', async () => {
  const env = entorno('MenuItem'); const caso = new CrearMenuItem(env.repo as unknown as RepositorioItemsMenu, env.auth, env.reloj, env.menus as unknown as ConstructorParameters<typeof CrearMenuItem>[3])
  const resultado = await caso.ejecutar(contexto, entrada('MenuItem'))
  assert.equal(resultado.id, 99n)
  assert.equal(env.llamadas.find(x => x.operacion === 'crear')?.args[1].actorId, actor)
})

test('EditarMenuItem: autoriza antes de consultar o escribir', async () => {
  const env = entorno('MenuItem'); env.opciones.permitir = false; const caso = new EditarMenuItem(env.repo as unknown as RepositorioItemsMenu, env.auth, env.reloj, env.menus as unknown as ConstructorParameters<typeof EditarMenuItem>[3])
  await assert.rejects(caso.ejecutar(contexto, 2n, antes, entrada('MenuItem')), /Acceso denegado/)
  assert.equal(env.llamadas.length, 0)
  assert.deepEqual(env.permisos, [...codigosPermisoCms('items_menu', 'manage')])
})

test('EditarMenuItem: aplica operación y conserva contexto/versión', async () => {
  const env = entorno('MenuItem'); const caso = new EditarMenuItem(env.repo as unknown as RepositorioItemsMenu, env.auth, env.reloj, env.menus as unknown as ConstructorParameters<typeof EditarMenuItem>[3])
  const resultado = await caso.ejecutar(contexto, 2n, antes, entrada('MenuItem'))
  assert.equal(resultado.id, env.actual.id)
  const guardado = env.llamadas.find(x => x.operacion === 'guardar')!
  assert.equal(guardado.args[1].getTime(), antes.getTime())
  assert.equal(guardado.args[2].ipAddress, contexto.ipAddress)
  assert.equal(guardado.args[2].userAgent, contexto.userAgent)
  assert.ok(guardado.args[2].cuando > antes)
})

test('EliminarMenuItem: autoriza antes de consultar o escribir', async () => {
  const env = entorno('MenuItem'); env.opciones.permitir = false; const caso = new EliminarMenuItem(env.repo as unknown as RepositorioItemsMenu, env.auth, env.reloj, env.menus as unknown as ConstructorParameters<typeof EliminarMenuItem>[3])
  await assert.rejects(caso.ejecutar(contexto, 2n, antes), /Acceso denegado/)
  assert.equal(env.llamadas.length, 0)
  assert.deepEqual(env.permisos, [...codigosPermisoCms('items_menu', 'manage')])
})

test('EliminarMenuItem: aplica operación y conserva contexto/versión', async () => {
  const env = entorno('MenuItem'); const caso = new EliminarMenuItem(env.repo as unknown as RepositorioItemsMenu, env.auth, env.reloj, env.menus as unknown as ConstructorParameters<typeof EliminarMenuItem>[3])
  const resultado = await caso.ejecutar(contexto, 2n, antes)
  assert.equal(resultado.id, env.actual.id)
  const guardado = env.llamadas.find(x => x.operacion === 'guardar')!
  assert.equal(guardado.args[1].getTime(), antes.getTime())
  assert.equal(guardado.args[2].ipAddress, contexto.ipAddress)
  assert.equal(guardado.args[2].userAgent, contexto.userAgent)
  assert.ok(guardado.args[2].cuando > antes)
  assert.equal(resultado.estado, 'eliminado')
  assert.equal(resultado.eliminadoEn?.getTime(), resultado.actualizadoEn.getTime())
})

test('InactivarMenuItem: autoriza antes de consultar o escribir', async () => {
  const env = entorno('MenuItem'); env.opciones.permitir = false; const caso = new InactivarMenuItem(env.repo as unknown as RepositorioItemsMenu, env.auth, env.reloj, env.menus as unknown as ConstructorParameters<typeof InactivarMenuItem>[3])
  await assert.rejects(caso.ejecutar(contexto, 2n, antes), /Acceso denegado/)
  assert.equal(env.llamadas.length, 0)
  assert.deepEqual(env.permisos, [...codigosPermisoCms('items_menu', 'manage')])
})

test('InactivarMenuItem: aplica operación y conserva contexto/versión', async () => {
  const env = entorno('MenuItem'); const caso = new InactivarMenuItem(env.repo as unknown as RepositorioItemsMenu, env.auth, env.reloj, env.menus as unknown as ConstructorParameters<typeof InactivarMenuItem>[3])
  const resultado = await caso.ejecutar(contexto, 2n, antes)
  assert.equal(resultado.id, env.actual.id)
  const guardado = env.llamadas.find(x => x.operacion === 'guardar')!
  assert.equal(guardado.args[1].getTime(), antes.getTime())
  assert.equal(guardado.args[2].ipAddress, contexto.ipAddress)
  assert.equal(guardado.args[2].userAgent, contexto.userAgent)
  assert.ok(guardado.args[2].cuando > antes)
  assert.equal(resultado.estado, 'inactivo')
})

test('ListarItemsMenu: autoriza antes de consultar o escribir', async () => {
  const env = entorno('MenuItem'); env.opciones.permitir = false; const caso = new ListarItemsMenu(env.repo as unknown as RepositorioItemsMenu, env.auth)
  await assert.rejects(caso.ejecutar(actor, {}), /Acceso denegado/)
  assert.equal(env.llamadas.length, 0)
  assert.deepEqual(env.permisos, [...codigosPermisoCms('items_menu', 'read')])
})

test('ListarItemsMenu: aplica operación y conserva contexto/versión', async () => {
  const env = entorno('MenuItem'); const caso = new ListarItemsMenu(env.repo as unknown as RepositorioItemsMenu, env.auth)
  const resultado = await caso.ejecutar(actor, {})
  assert.ok(resultado)
})

test('ObtenerMenuItem: autoriza antes de consultar o escribir', async () => {
  const env = entorno('MenuItem'); env.opciones.permitir = false; const caso = new ObtenerMenuItem(env.repo as unknown as RepositorioItemsMenu, env.auth)
  await assert.rejects(caso.ejecutar(actor, 2n), /Acceso denegado/)
  assert.equal(env.llamadas.length, 0)
  assert.deepEqual(env.permisos, [...codigosPermisoCms('items_menu', 'read')])
})

test('ObtenerMenuItem: aplica operación y conserva contexto/versión', async () => {
  const env = entorno('MenuItem'); const caso = new ObtenerMenuItem(env.repo as unknown as RepositorioItemsMenu, env.auth)
  const resultado = await caso.ejecutar(actor, 2n)
  assert.ok(resultado)
})

test('ReordenarMenuItem: autoriza antes de consultar o escribir', async () => {
  const env = entorno('MenuItem'); env.opciones.permitir = false; const caso = new ReordenarMenuItem(env.repo as unknown as RepositorioItemsMenu, env.auth, env.reloj, env.menus as unknown as ConstructorParameters<typeof ReordenarMenuItem>[3])
  await assert.rejects(caso.ejecutar(contexto, 2n, antes, 4), /Acceso denegado/)
  assert.equal(env.llamadas.length, 0)
  assert.deepEqual(env.permisos, [...codigosPermisoCms('items_menu', 'manage')])
})

test('ReordenarMenuItem: aplica operación y conserva contexto/versión', async () => {
  const env = entorno('MenuItem'); const caso = new ReordenarMenuItem(env.repo as unknown as RepositorioItemsMenu, env.auth, env.reloj, env.menus as unknown as ConstructorParameters<typeof ReordenarMenuItem>[3])
  const resultado = await caso.ejecutar(contexto, 2n, antes, 4)
  assert.equal(resultado.id, env.actual.id)
  const guardado = env.llamadas.find(x => x.operacion === 'guardar')!
  assert.equal(guardado.args[1].getTime(), antes.getTime())
  assert.equal(guardado.args[2].ipAddress, contexto.ipAddress)
  assert.equal(guardado.args[2].userAgent, contexto.userAgent)
  assert.ok(guardado.args[2].cuando > antes)
  assert.equal(resultado.orden.value, 4)
})

test('MenuItem: versión obsoleta impide guardar', async () => {
  const env = entorno('MenuItem'); const caso = new EditarMenuItem(env.repo as unknown as ConstructorParameters<typeof EditarMenuItem>[0], env.auth as unknown as ConstructorParameters<typeof EditarMenuItem>[1], env.reloj as unknown as ConstructorParameters<typeof EditarMenuItem>[2], env.menus as unknown as ConstructorParameters<typeof EditarMenuItem>[3])
  await assert.rejects(caso.ejecutar(contexto, 2n, despues, entrada('MenuItem')), /modificado/)
  assert.equal(env.llamadas.filter(x => x.operacion === 'guardar').length, 0)
})

test('MenuItem: creación inválida se rechaza antes de persistir', async () => {
  const env = entorno('MenuItem'); const caso = new CrearMenuItem(env.repo as unknown as ConstructorParameters<typeof CrearMenuItem>[0], env.auth as unknown as ConstructorParameters<typeof CrearMenuItem>[1], env.reloj as unknown as ConstructorParameters<typeof CrearMenuItem>[2], env.menus as unknown as ConstructorParameters<typeof CrearMenuItem>[3])
  await assert.rejects(caso.ejecutar(contexto, { ...entrada('MenuItem'), nombre: '   ' }))
  assert.equal(env.llamadas.filter(x => x.operacion === 'crear').length, 0)
})

test('MenuItem: baja lógica visible solo a super_admin e ineditable', async () => {
  const env = entorno('MenuItem'); env.actual.eliminar(despues); const lectura = new ObtenerMenuItem(env.repo as unknown as ConstructorParameters<typeof ObtenerMenuItem>[0], env.auth as unknown as ConstructorParameters<typeof ObtenerMenuItem>[1])
  await assert.rejects(lectura.ejecutar(actor, 2n), /no disponible/)
  env.opciones.superAdmin = true
  assert.ok(await lectura.ejecutar(actor, 2n))
  const edicion = new EditarMenuItem(env.repo as unknown as ConstructorParameters<typeof EditarMenuItem>[0], env.auth as unknown as ConstructorParameters<typeof EditarMenuItem>[1], env.reloj as unknown as ConstructorParameters<typeof EditarMenuItem>[2], env.menus as unknown as ConstructorParameters<typeof EditarMenuItem>[3])
  await assert.rejects(edicion.ejecutar(contexto, 2n, despues, entrada('MenuItem')), /no disponible/)
})

test('MenuItem: orden inválido no llega a guardar', async () => {
  const env = entorno('MenuItem'); const caso = new ReordenarMenuItem(env.repo as unknown as ConstructorParameters<typeof ReordenarMenuItem>[0], env.auth as unknown as ConstructorParameters<typeof ReordenarMenuItem>[1], env.reloj as unknown as ConstructorParameters<typeof ReordenarMenuItem>[2], env.menus as unknown as ConstructorParameters<typeof ReordenarMenuItem>[3])
  await assert.rejects(caso.ejecutar(contexto, 2n, antes, -1), /Orden inválido/)
  assert.equal(env.llamadas.filter(x => x.operacion === 'guardar').length, 0)
})

test('ítems: escritura avanza tras la versión del menú padre', async () => {
  const env = entorno('MenuItem'); env.menu.reordenar(env.menu.orden, despues)
  const caso = new EditarMenuItem(env.repo as unknown as RepositorioItemsMenu, env.auth, env.reloj,
    env.menus as unknown as ConstructorParameters<typeof EditarMenuItem>[3])
  await caso.ejecutar(contexto, 2n, antes, { nombre: 'Otro nombre' })
  assert.equal(env.llamadas.find(x => x.operacion === 'guardar')?.args[2].cuando.getTime(), despues.getTime()+1)
})
