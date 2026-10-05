import assert from 'node:assert/strict'
import { test } from 'node:test'
import { entorno, entrada, contexto, actor, antes, despues } from './soporte-pruebas-cms.js'
import type { RepositorioRegistrosCMS } from '../ports/repositorio-registro-cms.js'
import { ActivarRegistroCMS } from '../use-cases/registros-cms/activar-registro-cms.js'
import { CrearRegistroCMS } from '../use-cases/registros-cms/crear-registro-cms.js'
import { EditarRegistroCMS } from '../use-cases/registros-cms/editar-registro-cms.js'
import { EliminarRegistroCMS } from '../use-cases/registros-cms/eliminar-registro-cms.js'
import { InactivarRegistroCMS } from '../use-cases/registros-cms/inactivar-registro-cms.js'
import { ListarRegistrosCMS } from '../use-cases/registros-cms/listar-registros-cms.js'
import { ObtenerRegistroCMS } from '../use-cases/registros-cms/obtener-registro-cms.js'
import { ReordenarRegistroCMS } from '../use-cases/registros-cms/reordenar-registro-cms.js'

test('ActivarRegistroCMS: autoriza antes de consultar o escribir', async () => {
  const env = entorno('RegistroCMS'); env.opciones.permitir = false; const caso = new ActivarRegistroCMS(env.repo as unknown as RepositorioRegistrosCMS, env.auth, env.reloj)
  await assert.rejects(caso.ejecutar(contexto, 2n, antes), /Acceso denegado/)
  assert.equal(env.llamadas.length, 0)
  assert.deepEqual(env.permisos, ['cms.registros_cms.manage'])
})

test('ActivarRegistroCMS: aplica operación y conserva contexto/versión', async () => {
  const env = entorno('RegistroCMS'); env.actual.inactivar(antes); const caso = new ActivarRegistroCMS(env.repo as unknown as RepositorioRegistrosCMS, env.auth, env.reloj)
  const resultado = await caso.ejecutar(contexto, 2n, antes)
  assert.equal(resultado.id, env.actual.id)
  const guardado = env.llamadas.find(x => x.operacion === 'guardar')!
  assert.equal(guardado.args[1].getTime(), antes.getTime())
  assert.equal(guardado.args[2].ipAddress, contexto.ipAddress)
  assert.equal(guardado.args[2].userAgent, contexto.userAgent)
  assert.ok(guardado.args[2].cuando > antes)
  assert.equal(resultado.estado, 'activo')
})

test('CrearRegistroCMS: autoriza antes de consultar o escribir', async () => {
  const env = entorno('RegistroCMS'); env.opciones.permitir = false; const caso = new CrearRegistroCMS(env.repo as unknown as RepositorioRegistrosCMS, env.auth, env.reloj)
  await assert.rejects(caso.ejecutar(contexto, entrada('RegistroCMS')), /Acceso denegado/)
  assert.equal(env.llamadas.length, 0)
  assert.deepEqual(env.permisos, ['cms.registros_cms.manage'])
})

test('CrearRegistroCMS: aplica operación y conserva contexto/versión', async () => {
  const env = entorno('RegistroCMS'); const caso = new CrearRegistroCMS(env.repo as unknown as RepositorioRegistrosCMS, env.auth, env.reloj)
  const resultado = await caso.ejecutar(contexto, entrada('RegistroCMS'))
  assert.equal(resultado.id, 99n)
  assert.equal(env.llamadas.find(x => x.operacion === 'crear')?.args[1].actorId, actor)
})

test('EditarRegistroCMS: autoriza antes de consultar o escribir', async () => {
  const env = entorno('RegistroCMS'); env.opciones.permitir = false; const caso = new EditarRegistroCMS(env.repo as unknown as RepositorioRegistrosCMS, env.auth, env.reloj)
  await assert.rejects(caso.ejecutar(contexto, 2n, antes, entrada('RegistroCMS')), /Acceso denegado/)
  assert.equal(env.llamadas.length, 0)
  assert.deepEqual(env.permisos, ['cms.registros_cms.manage'])
})

test('EditarRegistroCMS: aplica operación y conserva contexto/versión', async () => {
  const env = entorno('RegistroCMS'); const caso = new EditarRegistroCMS(env.repo as unknown as RepositorioRegistrosCMS, env.auth, env.reloj)
  const resultado = await caso.ejecutar(contexto, 2n, antes, entrada('RegistroCMS'))
  assert.equal(resultado.id, env.actual.id)
  const guardado = env.llamadas.find(x => x.operacion === 'guardar')!
  assert.equal(guardado.args[1].getTime(), antes.getTime())
  assert.equal(guardado.args[2].ipAddress, contexto.ipAddress)
  assert.equal(guardado.args[2].userAgent, contexto.userAgent)
  assert.ok(guardado.args[2].cuando > antes)
})

test('EliminarRegistroCMS: autoriza antes de consultar o escribir', async () => {
  const env = entorno('RegistroCMS'); env.opciones.permitir = false; const caso = new EliminarRegistroCMS(env.repo as unknown as RepositorioRegistrosCMS, env.auth, env.reloj)
  await assert.rejects(caso.ejecutar(contexto, 2n, antes), /Acceso denegado/)
  assert.equal(env.llamadas.length, 0)
  assert.deepEqual(env.permisos, ['cms.registros_cms.manage'])
})

test('EliminarRegistroCMS: aplica operación y conserva contexto/versión', async () => {
  const env = entorno('RegistroCMS'); const caso = new EliminarRegistroCMS(env.repo as unknown as RepositorioRegistrosCMS, env.auth, env.reloj)
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

test('InactivarRegistroCMS: autoriza antes de consultar o escribir', async () => {
  const env = entorno('RegistroCMS'); env.opciones.permitir = false; const caso = new InactivarRegistroCMS(env.repo as unknown as RepositorioRegistrosCMS, env.auth, env.reloj)
  await assert.rejects(caso.ejecutar(contexto, 2n, antes), /Acceso denegado/)
  assert.equal(env.llamadas.length, 0)
  assert.deepEqual(env.permisos, ['cms.registros_cms.manage'])
})

test('InactivarRegistroCMS: aplica operación y conserva contexto/versión', async () => {
  const env = entorno('RegistroCMS'); const caso = new InactivarRegistroCMS(env.repo as unknown as RepositorioRegistrosCMS, env.auth, env.reloj)
  const resultado = await caso.ejecutar(contexto, 2n, antes)
  assert.equal(resultado.id, env.actual.id)
  const guardado = env.llamadas.find(x => x.operacion === 'guardar')!
  assert.equal(guardado.args[1].getTime(), antes.getTime())
  assert.equal(guardado.args[2].ipAddress, contexto.ipAddress)
  assert.equal(guardado.args[2].userAgent, contexto.userAgent)
  assert.ok(guardado.args[2].cuando > antes)
  assert.equal(resultado.estado, 'inactivo')
})

test('ListarRegistrosCMS: autoriza antes de consultar o escribir', async () => {
  const env = entorno('RegistroCMS'); env.opciones.permitir = false; const caso = new ListarRegistrosCMS(env.repo as unknown as RepositorioRegistrosCMS, env.auth)
  await assert.rejects(caso.ejecutar(actor, {}), /Acceso denegado/)
  assert.equal(env.llamadas.length, 0)
  assert.deepEqual(env.permisos, ['cms.registros_cms.read'])
})

test('ListarRegistrosCMS: aplica operación y conserva contexto/versión', async () => {
  const env = entorno('RegistroCMS'); const caso = new ListarRegistrosCMS(env.repo as unknown as RepositorioRegistrosCMS, env.auth)
  const resultado = await caso.ejecutar(actor, {})
  assert.ok(resultado)
})

test('ObtenerRegistroCMS: autoriza antes de consultar o escribir', async () => {
  const env = entorno('RegistroCMS'); env.opciones.permitir = false; const caso = new ObtenerRegistroCMS(env.repo as unknown as RepositorioRegistrosCMS, env.auth)
  await assert.rejects(caso.ejecutar(actor, 2n), /Acceso denegado/)
  assert.equal(env.llamadas.length, 0)
  assert.deepEqual(env.permisos, ['cms.registros_cms.read'])
})

test('ObtenerRegistroCMS: aplica operación y conserva contexto/versión', async () => {
  const env = entorno('RegistroCMS'); const caso = new ObtenerRegistroCMS(env.repo as unknown as RepositorioRegistrosCMS, env.auth)
  const resultado = await caso.ejecutar(actor, 2n)
  assert.ok(resultado)
})

test('ReordenarRegistroCMS: autoriza antes de consultar o escribir', async () => {
  const env = entorno('RegistroCMS'); env.opciones.permitir = false; const caso = new ReordenarRegistroCMS(env.repo as unknown as RepositorioRegistrosCMS, env.auth, env.reloj)
  await assert.rejects(caso.ejecutar(contexto, 2n, antes, 4), /Acceso denegado/)
  assert.equal(env.llamadas.length, 0)
  assert.deepEqual(env.permisos, ['cms.registros_cms.manage'])
})

test('ReordenarRegistroCMS: aplica operación y conserva contexto/versión', async () => {
  const env = entorno('RegistroCMS'); const caso = new ReordenarRegistroCMS(env.repo as unknown as RepositorioRegistrosCMS, env.auth, env.reloj)
  const resultado = await caso.ejecutar(contexto, 2n, antes, 4)
  assert.equal(resultado.id, env.actual.id)
  const guardado = env.llamadas.find(x => x.operacion === 'guardar')!
  assert.equal(guardado.args[1].getTime(), antes.getTime())
  assert.equal(guardado.args[2].ipAddress, contexto.ipAddress)
  assert.equal(guardado.args[2].userAgent, contexto.userAgent)
  assert.ok(guardado.args[2].cuando > antes)
  assert.equal(resultado.orden.value, 4)
})

test('RegistroCMS: versión obsoleta impide guardar', async () => {
  const env = entorno('RegistroCMS'); const caso = new EditarRegistroCMS(env.repo as unknown as ConstructorParameters<typeof EditarRegistroCMS>[0], env.auth as unknown as ConstructorParameters<typeof EditarRegistroCMS>[1], env.reloj as unknown as ConstructorParameters<typeof EditarRegistroCMS>[2])
  await assert.rejects(caso.ejecutar(contexto, 2n, despues, entrada('RegistroCMS')), /modificado/)
  assert.equal(env.llamadas.filter(x => x.operacion === 'guardar').length, 0)
})

test('RegistroCMS: creación inválida se rechaza antes de persistir', async () => {
  const env = entorno('RegistroCMS'); const caso = new CrearRegistroCMS(env.repo as unknown as ConstructorParameters<typeof CrearRegistroCMS>[0], env.auth as unknown as ConstructorParameters<typeof CrearRegistroCMS>[1], env.reloj as unknown as ConstructorParameters<typeof CrearRegistroCMS>[2])
  await assert.rejects(caso.ejecutar(contexto, { ...entrada('RegistroCMS'), nombre: '' }))
  assert.equal(env.llamadas.filter(x => x.operacion === 'crear').length, 0)
})

test('RegistroCMS: baja lógica visible solo a super_admin e ineditable', async () => {
  const env = entorno('RegistroCMS'); env.actual.eliminar(despues); const lectura = new ObtenerRegistroCMS(env.repo as unknown as ConstructorParameters<typeof ObtenerRegistroCMS>[0], env.auth as unknown as ConstructorParameters<typeof ObtenerRegistroCMS>[1])
  await assert.rejects(lectura.ejecutar(actor, 2n), /no disponible/)
  env.opciones.superAdmin = true
  assert.ok(await lectura.ejecutar(actor, 2n))
  const edicion = new EditarRegistroCMS(env.repo as unknown as ConstructorParameters<typeof EditarRegistroCMS>[0], env.auth as unknown as ConstructorParameters<typeof EditarRegistroCMS>[1], env.reloj as unknown as ConstructorParameters<typeof EditarRegistroCMS>[2])
  await assert.rejects(edicion.ejecutar(contexto, 2n, despues, entrada('RegistroCMS')), /no disponible/)
})

test('RegistroCMS: orden inválido no llega a guardar', async () => {
  const env = entorno('RegistroCMS'); const caso = new ReordenarRegistroCMS(env.repo as unknown as ConstructorParameters<typeof ReordenarRegistroCMS>[0], env.auth as unknown as ConstructorParameters<typeof ReordenarRegistroCMS>[1], env.reloj as unknown as ConstructorParameters<typeof ReordenarRegistroCMS>[2])
  await assert.rejects(caso.ejecutar(contexto, 2n, antes, -1), /Orden inválido/)
  assert.equal(env.llamadas.filter(x => x.operacion === 'guardar').length, 0)
})
