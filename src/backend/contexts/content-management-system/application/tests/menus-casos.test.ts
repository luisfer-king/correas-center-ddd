import { codigosPermisoCms } from '../permisos-cms.js'
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { entorno, entrada, contexto, actor, antes, despues } from './soporte-pruebas-cms.js'
import type { RepositorioMenus } from '../ports/repositorio-menu.js'
import { ActivarMenu } from '../use-cases/menus/activar-menu.js'
import { CrearMenu } from '../use-cases/menus/crear-menu.js'
import { EditarMenu } from '../use-cases/menus/editar-menu.js'
import { EliminarMenu } from '../use-cases/menus/eliminar-menu.js'
import { FijarVisibilidadMenu } from '../use-cases/menus/fijar-visibilidad-menu.js'
import { InactivarMenu } from '../use-cases/menus/inactivar-menu.js'
import { ListarMenus } from '../use-cases/menus/listar-menus.js'
import { ObtenerMenu } from '../use-cases/menus/obtener-menu.js'
import { ReordenarMenu } from '../use-cases/menus/reordenar-menu.js'

test('ActivarMenu: autoriza antes de consultar o escribir', async () => {
  const env = entorno('Menu'); env.opciones.permitir = false; const caso = new ActivarMenu(env.repo as unknown as RepositorioMenus, env.auth, env.reloj)
  await assert.rejects(caso.ejecutar(contexto, 2n, antes), /Acceso denegado/)
  assert.equal(env.llamadas.length, 0)
  assert.deepEqual(env.permisos, [...codigosPermisoCms('menus', 'manage')])
})

test('ActivarMenu: aplica operación y conserva contexto/versión', async () => {
  const env = entorno('Menu'); env.actual.inactivar(antes); const caso = new ActivarMenu(env.repo as unknown as RepositorioMenus, env.auth, env.reloj)
  const resultado = await caso.ejecutar(contexto, 2n, antes)
  assert.equal(resultado.id, env.actual.id)
  const guardado = env.llamadas.find(x => x.operacion === 'guardar')!
  assert.equal(guardado.args[1].getTime(), antes.getTime())
  assert.equal(guardado.args[2].ipAddress, contexto.ipAddress)
  assert.equal(guardado.args[2].userAgent, contexto.userAgent)
  assert.ok(guardado.args[2].cuando > antes)
  assert.equal(resultado.estado, 'activo')
})

test('CrearMenu: autoriza antes de consultar o escribir', async () => {
  const env = entorno('Menu'); env.opciones.permitir = false; const caso = new CrearMenu(env.repo as unknown as RepositorioMenus, env.auth, env.reloj)
  await assert.rejects(caso.ejecutar(contexto, entrada('Menu')), /Acceso denegado/)
  assert.equal(env.llamadas.length, 0)
  assert.deepEqual(env.permisos, [...codigosPermisoCms('menus', 'manage')])
})

test('CrearMenu: aplica operación y conserva contexto/versión', async () => {
  const env = entorno('Menu'); const caso = new CrearMenu(env.repo as unknown as RepositorioMenus, env.auth, env.reloj)
  const resultado = await caso.ejecutar(contexto, entrada('Menu'))
  assert.equal(resultado.id, 99n)
  assert.equal(env.llamadas.find(x => x.operacion === 'crear')?.args[1].actorId, actor)
})

test('EditarMenu: autoriza antes de consultar o escribir', async () => {
  const env = entorno('Menu'); env.opciones.permitir = false; const caso = new EditarMenu(env.repo as unknown as RepositorioMenus, env.auth, env.reloj)
  await assert.rejects(caso.ejecutar(contexto, 2n, antes, entrada('Menu')), /Acceso denegado/)
  assert.equal(env.llamadas.length, 0)
  assert.deepEqual(env.permisos, [...codigosPermisoCms('menus', 'manage')])
})

test('EditarMenu: aplica operación y conserva contexto/versión', async () => {
  const env = entorno('Menu'); const caso = new EditarMenu(env.repo as unknown as RepositorioMenus, env.auth, env.reloj)
  const resultado = await caso.ejecutar(contexto, 2n, antes, entrada('Menu'))
  assert.equal(resultado.id, env.actual.id)
  const guardado = env.llamadas.find(x => x.operacion === 'guardar')!
  assert.equal(guardado.args[1].getTime(), antes.getTime())
  assert.equal(guardado.args[2].ipAddress, contexto.ipAddress)
  assert.equal(guardado.args[2].userAgent, contexto.userAgent)
  assert.ok(guardado.args[2].cuando > antes)
})

test('EliminarMenu: autoriza antes de consultar o escribir', async () => {
  const env = entorno('Menu'); env.opciones.permitir = false; const caso = new EliminarMenu(env.repo as unknown as RepositorioMenus, env.auth, env.reloj)
  await assert.rejects(caso.ejecutar(contexto, 2n, antes), /Acceso denegado/)
  assert.equal(env.llamadas.length, 0)
  assert.deepEqual(env.permisos, [...codigosPermisoCms('menus', 'manage')])
})

test('EliminarMenu: aplica operación y conserva contexto/versión', async () => {
  const env = entorno('Menu'); const caso = new EliminarMenu(env.repo as unknown as RepositorioMenus, env.auth, env.reloj)
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

test('FijarVisibilidadMenu: autoriza antes de consultar o escribir', async () => {
  const env = entorno('Menu'); env.opciones.permitir = false; const caso = new FijarVisibilidadMenu(env.repo as unknown as RepositorioMenus, env.auth, env.reloj)
  await assert.rejects(caso.ejecutar(contexto, 2n, antes, false), /Acceso denegado/)
  assert.equal(env.llamadas.length, 0)
  assert.deepEqual(env.permisos, [...codigosPermisoCms('menus', 'manage')])
})

test('FijarVisibilidadMenu: aplica operación y conserva contexto/versión', async () => {
  const env = entorno('Menu'); const caso = new FijarVisibilidadMenu(env.repo as unknown as RepositorioMenus, env.auth, env.reloj)
  const resultado = await caso.ejecutar(contexto, 2n, antes, false)
  assert.equal(resultado.id, env.actual.id)
  const guardado = env.llamadas.find(x => x.operacion === 'guardar')!
  assert.equal(guardado.args[1].getTime(), antes.getTime())
  assert.equal(guardado.args[2].ipAddress, contexto.ipAddress)
  assert.equal(guardado.args[2].userAgent, contexto.userAgent)
  assert.ok(guardado.args[2].cuando > antes)
  assert.equal(resultado.mostrar, false)
})

test('InactivarMenu: autoriza antes de consultar o escribir', async () => {
  const env = entorno('Menu'); env.opciones.permitir = false; const caso = new InactivarMenu(env.repo as unknown as RepositorioMenus, env.auth, env.reloj)
  await assert.rejects(caso.ejecutar(contexto, 2n, antes), /Acceso denegado/)
  assert.equal(env.llamadas.length, 0)
  assert.deepEqual(env.permisos, [...codigosPermisoCms('menus', 'manage')])
})

test('InactivarMenu: aplica operación y conserva contexto/versión', async () => {
  const env = entorno('Menu'); const caso = new InactivarMenu(env.repo as unknown as RepositorioMenus, env.auth, env.reloj)
  const resultado = await caso.ejecutar(contexto, 2n, antes)
  assert.equal(resultado.id, env.actual.id)
  const guardado = env.llamadas.find(x => x.operacion === 'guardar')!
  assert.equal(guardado.args[1].getTime(), antes.getTime())
  assert.equal(guardado.args[2].ipAddress, contexto.ipAddress)
  assert.equal(guardado.args[2].userAgent, contexto.userAgent)
  assert.ok(guardado.args[2].cuando > antes)
  assert.equal(resultado.estado, 'inactivo')
})

test('ListarMenus: autoriza antes de consultar o escribir', async () => {
  const env = entorno('Menu'); env.opciones.permitir = false; const caso = new ListarMenus(env.repo as unknown as RepositorioMenus, env.auth)
  await assert.rejects(caso.ejecutar(actor, {}), /Acceso denegado/)
  assert.equal(env.llamadas.length, 0)
  assert.deepEqual(env.permisos, [...codigosPermisoCms('menus', 'read')])
})

test('ListarMenus: aplica operación y conserva contexto/versión', async () => {
  const env = entorno('Menu'); const caso = new ListarMenus(env.repo as unknown as RepositorioMenus, env.auth)
  const resultado = await caso.ejecutar(actor, {})
  assert.ok(resultado)
})

test('ObtenerMenu: autoriza antes de consultar o escribir', async () => {
  const env = entorno('Menu'); env.opciones.permitir = false; const caso = new ObtenerMenu(env.repo as unknown as RepositorioMenus, env.auth)
  await assert.rejects(caso.ejecutar(actor, 2n), /Acceso denegado/)
  assert.equal(env.llamadas.length, 0)
  assert.deepEqual(env.permisos, [...codigosPermisoCms('menus', 'read')])
})

test('ObtenerMenu: aplica operación y conserva contexto/versión', async () => {
  const env = entorno('Menu'); const caso = new ObtenerMenu(env.repo as unknown as RepositorioMenus, env.auth)
  const resultado = await caso.ejecutar(actor, 2n)
  assert.ok(resultado)
})

test('ReordenarMenu: autoriza antes de consultar o escribir', async () => {
  const env = entorno('Menu'); env.opciones.permitir = false; const caso = new ReordenarMenu(env.repo as unknown as RepositorioMenus, env.auth, env.reloj)
  await assert.rejects(caso.ejecutar(contexto, 2n, antes, 4), /Acceso denegado/)
  assert.equal(env.llamadas.length, 0)
  assert.deepEqual(env.permisos, [...codigosPermisoCms('menus', 'manage')])
})

test('ReordenarMenu: aplica operación y conserva contexto/versión', async () => {
  const env = entorno('Menu'); const caso = new ReordenarMenu(env.repo as unknown as RepositorioMenus, env.auth, env.reloj)
  const resultado = await caso.ejecutar(contexto, 2n, antes, 4)
  assert.equal(resultado.id, env.actual.id)
  const guardado = env.llamadas.find(x => x.operacion === 'guardar')!
  assert.equal(guardado.args[1].getTime(), antes.getTime())
  assert.equal(guardado.args[2].ipAddress, contexto.ipAddress)
  assert.equal(guardado.args[2].userAgent, contexto.userAgent)
  assert.ok(guardado.args[2].cuando > antes)
  assert.equal(resultado.orden.value, 4)
})

test('Menu: versión obsoleta impide guardar', async () => {
  const env = entorno('Menu'); const caso = new EditarMenu(env.repo as unknown as ConstructorParameters<typeof EditarMenu>[0], env.auth as unknown as ConstructorParameters<typeof EditarMenu>[1], env.reloj as unknown as ConstructorParameters<typeof EditarMenu>[2])
  await assert.rejects(caso.ejecutar(contexto, 2n, despues, entrada('Menu')), /modificado/)
  assert.equal(env.llamadas.filter(x => x.operacion === 'guardar').length, 0)
})

test('Menu: creación inválida se rechaza antes de persistir', async () => {
  const env = entorno('Menu'); const caso = new CrearMenu(env.repo as unknown as ConstructorParameters<typeof CrearMenu>[0], env.auth as unknown as ConstructorParameters<typeof CrearMenu>[1], env.reloj as unknown as ConstructorParameters<typeof CrearMenu>[2])
  await assert.rejects(caso.ejecutar(contexto, { ...entrada('Menu'), ruta: '//externo.example' }))
  assert.equal(env.llamadas.filter(x => x.operacion === 'crear').length, 0)
})

test('Menu: baja lógica visible solo a super_admin e ineditable', async () => {
  const env = entorno('Menu'); env.actual.eliminar(despues); const lectura = new ObtenerMenu(env.repo as unknown as ConstructorParameters<typeof ObtenerMenu>[0], env.auth as unknown as ConstructorParameters<typeof ObtenerMenu>[1])
  await assert.rejects(lectura.ejecutar(actor, 2n), /no disponible/)
  env.opciones.superAdmin = true
  assert.ok(await lectura.ejecutar(actor, 2n))
  const edicion = new EditarMenu(env.repo as unknown as ConstructorParameters<typeof EditarMenu>[0], env.auth as unknown as ConstructorParameters<typeof EditarMenu>[1], env.reloj as unknown as ConstructorParameters<typeof EditarMenu>[2])
  await assert.rejects(edicion.ejecutar(contexto, 2n, despues, entrada('Menu')), /no disponible/)
})

test('Menu: orden inválido no llega a guardar', async () => {
  const env = entorno('Menu'); const caso = new ReordenarMenu(env.repo as unknown as ConstructorParameters<typeof ReordenarMenu>[0], env.auth as unknown as ConstructorParameters<typeof ReordenarMenu>[1], env.reloj as unknown as ConstructorParameters<typeof ReordenarMenu>[2])
  await assert.rejects(caso.ejecutar(contexto, 2n, antes, -1), /Orden inválido/)
  assert.equal(env.llamadas.filter(x => x.operacion === 'guardar').length, 0)
})
