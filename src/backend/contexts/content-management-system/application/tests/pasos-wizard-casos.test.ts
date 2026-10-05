import assert from 'node:assert/strict'
import { test } from 'node:test'
import { entorno, entrada, contexto, actor, antes, despues } from './soporte-pruebas-cms.js'
import type { RepositorioPasosWizard } from '../ports/repositorio-paso-wizard.js'
import { ActivarPasoWizard } from '../use-cases/pasos-wizard/activar-paso-wizard.js'
import { CrearPasoWizard } from '../use-cases/pasos-wizard/crear-paso-wizard.js'
import { EditarPasoWizard } from '../use-cases/pasos-wizard/editar-paso-wizard.js'
import { EliminarPasoWizard } from '../use-cases/pasos-wizard/eliminar-paso-wizard.js'
import { InactivarPasoWizard } from '../use-cases/pasos-wizard/inactivar-paso-wizard.js'
import { ListarPasosWizard } from '../use-cases/pasos-wizard/listar-pasos-wizard.js'
import { ObtenerPasoWizard } from '../use-cases/pasos-wizard/obtener-paso-wizard.js'
import { ReordenarPasoWizard } from '../use-cases/pasos-wizard/reordenar-paso-wizard.js'

test('ActivarPasoWizard: autoriza antes de consultar o escribir', async () => {
  const env = entorno('PasoWizard'); env.opciones.permitir = false; const caso = new ActivarPasoWizard(env.repo as unknown as RepositorioPasosWizard, env.auth, env.reloj, env.fuentes)
  await assert.rejects(caso.ejecutar(contexto, 2n, antes), /Acceso denegado/)
  assert.equal(env.llamadas.length, 0)
  assert.deepEqual(env.permisos, ['cms.pasos_wizard.manage'])
})

test('ActivarPasoWizard: aplica operación y conserva contexto/versión', async () => {
  const env = entorno('PasoWizard'); env.actual.inactivar(antes); const caso = new ActivarPasoWizard(env.repo as unknown as RepositorioPasosWizard, env.auth, env.reloj, env.fuentes)
  const resultado = await caso.ejecutar(contexto, 2n, antes)
  assert.equal(resultado.id, env.actual.id)
  const guardado = env.llamadas.find(x => x.operacion === 'guardar')!
  assert.equal(guardado.args[1].getTime(), antes.getTime())
  assert.equal(guardado.args[2].ipAddress, contexto.ipAddress)
  assert.equal(guardado.args[2].userAgent, contexto.userAgent)
  assert.ok(guardado.args[2].cuando > antes)
  assert.equal(resultado.estado, 'activo')
})

test('CrearPasoWizard: autoriza antes de consultar o escribir', async () => {
  const env = entorno('PasoWizard'); env.opciones.permitir = false; const caso = new CrearPasoWizard(env.repo as unknown as RepositorioPasosWizard, env.auth, env.reloj, env.fuentes)
  await assert.rejects(caso.ejecutar(contexto, entrada('PasoWizard')), /Acceso denegado/)
  assert.equal(env.llamadas.length, 0)
  assert.deepEqual(env.permisos, ['cms.pasos_wizard.manage'])
})

test('CrearPasoWizard: aplica operación y conserva contexto/versión', async () => {
  const env = entorno('PasoWizard'); const caso = new CrearPasoWizard(env.repo as unknown as RepositorioPasosWizard, env.auth, env.reloj, env.fuentes)
  const resultado = await caso.ejecutar(contexto, entrada('PasoWizard'))
  assert.equal(resultado.id, 99n)
  assert.equal(env.llamadas.find(x => x.operacion === 'crear')?.args[1].actorId, actor)
})

test('EditarPasoWizard: autoriza antes de consultar o escribir', async () => {
  const env = entorno('PasoWizard'); env.opciones.permitir = false; const caso = new EditarPasoWizard(env.repo as unknown as RepositorioPasosWizard, env.auth, env.reloj, env.fuentes)
  await assert.rejects(caso.ejecutar(contexto, 2n, antes, entrada('PasoWizard')), /Acceso denegado/)
  assert.equal(env.llamadas.length, 0)
  assert.deepEqual(env.permisos, ['cms.pasos_wizard.manage'])
})

test('EditarPasoWizard: aplica operación y conserva contexto/versión', async () => {
  const env = entorno('PasoWizard'); const caso = new EditarPasoWizard(env.repo as unknown as RepositorioPasosWizard, env.auth, env.reloj, env.fuentes)
  const resultado = await caso.ejecutar(contexto, 2n, antes, entrada('PasoWizard'))
  assert.equal(resultado.id, env.actual.id)
  const guardado = env.llamadas.find(x => x.operacion === 'guardar')!
  assert.equal(guardado.args[1].getTime(), antes.getTime())
  assert.equal(guardado.args[2].ipAddress, contexto.ipAddress)
  assert.equal(guardado.args[2].userAgent, contexto.userAgent)
  assert.ok(guardado.args[2].cuando > antes)
})

test('EliminarPasoWizard: autoriza antes de consultar o escribir', async () => {
  const env = entorno('PasoWizard'); env.opciones.permitir = false; const caso = new EliminarPasoWizard(env.repo as unknown as RepositorioPasosWizard, env.auth, env.reloj)
  await assert.rejects(caso.ejecutar(contexto, 2n, antes), /Acceso denegado/)
  assert.equal(env.llamadas.length, 0)
  assert.deepEqual(env.permisos, ['cms.pasos_wizard.manage'])
})

test('EliminarPasoWizard: aplica operación y conserva contexto/versión', async () => {
  const env = entorno('PasoWizard'); const caso = new EliminarPasoWizard(env.repo as unknown as RepositorioPasosWizard, env.auth, env.reloj)
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

test('InactivarPasoWizard: autoriza antes de consultar o escribir', async () => {
  const env = entorno('PasoWizard'); env.opciones.permitir = false; const caso = new InactivarPasoWizard(env.repo as unknown as RepositorioPasosWizard, env.auth, env.reloj)
  await assert.rejects(caso.ejecutar(contexto, 2n, antes), /Acceso denegado/)
  assert.equal(env.llamadas.length, 0)
  assert.deepEqual(env.permisos, ['cms.pasos_wizard.manage'])
})

test('InactivarPasoWizard: aplica operación y conserva contexto/versión', async () => {
  const env = entorno('PasoWizard'); const caso = new InactivarPasoWizard(env.repo as unknown as RepositorioPasosWizard, env.auth, env.reloj)
  const resultado = await caso.ejecutar(contexto, 2n, antes)
  assert.equal(resultado.id, env.actual.id)
  const guardado = env.llamadas.find(x => x.operacion === 'guardar')!
  assert.equal(guardado.args[1].getTime(), antes.getTime())
  assert.equal(guardado.args[2].ipAddress, contexto.ipAddress)
  assert.equal(guardado.args[2].userAgent, contexto.userAgent)
  assert.ok(guardado.args[2].cuando > antes)
  assert.equal(resultado.estado, 'inactivo')
})

test('ListarPasosWizard: autoriza antes de consultar o escribir', async () => {
  const env = entorno('PasoWizard'); env.opciones.permitir = false; const caso = new ListarPasosWizard(env.repo as unknown as RepositorioPasosWizard, env.auth)
  await assert.rejects(caso.ejecutar(actor, {}), /Acceso denegado/)
  assert.equal(env.llamadas.length, 0)
  assert.deepEqual(env.permisos, ['cms.pasos_wizard.read'])
})

test('ListarPasosWizard: aplica operación y conserva contexto/versión', async () => {
  const env = entorno('PasoWizard'); const caso = new ListarPasosWizard(env.repo as unknown as RepositorioPasosWizard, env.auth)
  const resultado = await caso.ejecutar(actor, {})
  assert.ok(resultado)
})

test('ObtenerPasoWizard: autoriza antes de consultar o escribir', async () => {
  const env = entorno('PasoWizard'); env.opciones.permitir = false; const caso = new ObtenerPasoWizard(env.repo as unknown as RepositorioPasosWizard, env.auth)
  await assert.rejects(caso.ejecutar(actor, 2n), /Acceso denegado/)
  assert.equal(env.llamadas.length, 0)
  assert.deepEqual(env.permisos, ['cms.pasos_wizard.read'])
})

test('ObtenerPasoWizard: aplica operación y conserva contexto/versión', async () => {
  const env = entorno('PasoWizard'); const caso = new ObtenerPasoWizard(env.repo as unknown as RepositorioPasosWizard, env.auth)
  const resultado = await caso.ejecutar(actor, 2n)
  assert.ok(resultado)
})

test('ReordenarPasoWizard: autoriza antes de consultar o escribir', async () => {
  const env = entorno('PasoWizard'); env.opciones.permitir = false; const caso = new ReordenarPasoWizard(env.repo as unknown as RepositorioPasosWizard, env.auth, env.reloj)
  await assert.rejects(caso.ejecutar(contexto, 2n, antes, 4), /Acceso denegado/)
  assert.equal(env.llamadas.length, 0)
  assert.deepEqual(env.permisos, ['cms.pasos_wizard.manage'])
})

test('ReordenarPasoWizard: aplica operación y conserva contexto/versión', async () => {
  const env = entorno('PasoWizard'); const caso = new ReordenarPasoWizard(env.repo as unknown as RepositorioPasosWizard, env.auth, env.reloj)
  const resultado = await caso.ejecutar(contexto, 2n, antes, 4)
  assert.equal(resultado.id, env.actual.id)
  const guardado = env.llamadas.find(x => x.operacion === 'guardar')!
  assert.equal(guardado.args[1].getTime(), antes.getTime())
  assert.equal(guardado.args[2].ipAddress, contexto.ipAddress)
  assert.equal(guardado.args[2].userAgent, contexto.userAgent)
  assert.ok(guardado.args[2].cuando > antes)
  assert.equal(resultado.orden.value, 4)
})

test('PasoWizard: versión obsoleta impide guardar', async () => {
  const env = entorno('PasoWizard'); const caso = new EditarPasoWizard(env.repo as unknown as ConstructorParameters<typeof EditarPasoWizard>[0], env.auth as unknown as ConstructorParameters<typeof EditarPasoWizard>[1], env.reloj as unknown as ConstructorParameters<typeof EditarPasoWizard>[2], env.fuentes as unknown as ConstructorParameters<typeof EditarPasoWizard>[3])
  await assert.rejects(caso.ejecutar(contexto, 2n, despues, entrada('PasoWizard')), /modificado/)
  assert.equal(env.llamadas.filter(x => x.operacion === 'guardar').length, 0)
})

test('PasoWizard: creación inválida se rechaza antes de persistir', async () => {
  const env = entorno('PasoWizard'); const caso = new CrearPasoWizard(env.repo as unknown as ConstructorParameters<typeof CrearPasoWizard>[0], env.auth as unknown as ConstructorParameters<typeof CrearPasoWizard>[1], env.reloj as unknown as ConstructorParameters<typeof CrearPasoWizard>[2], env.fuentes as unknown as ConstructorParameters<typeof CrearPasoWizard>[3])
  await assert.rejects(caso.ejecutar(contexto, { ...entrada('PasoWizard'), fuenteDatos: 'tabla_arbitraria' }))
  assert.equal(env.llamadas.filter(x => x.operacion === 'crear').length, 0)
})

test('PasoWizard: baja lógica visible solo a super_admin e ineditable', async () => {
  const env = entorno('PasoWizard'); env.actual.eliminar(despues); const lectura = new ObtenerPasoWizard(env.repo as unknown as ConstructorParameters<typeof ObtenerPasoWizard>[0], env.auth as unknown as ConstructorParameters<typeof ObtenerPasoWizard>[1])
  await assert.rejects(lectura.ejecutar(actor, 2n), /no disponible/)
  env.opciones.superAdmin = true
  assert.ok(await lectura.ejecutar(actor, 2n))
  const edicion = new EditarPasoWizard(env.repo as unknown as ConstructorParameters<typeof EditarPasoWizard>[0], env.auth as unknown as ConstructorParameters<typeof EditarPasoWizard>[1], env.reloj as unknown as ConstructorParameters<typeof EditarPasoWizard>[2], env.fuentes as unknown as ConstructorParameters<typeof EditarPasoWizard>[3])
  await assert.rejects(edicion.ejecutar(contexto, 2n, despues, entrada('PasoWizard')), /no disponible/)
})

test('PasoWizard: orden inválido no llega a guardar', async () => {
  const env = entorno('PasoWizard'); const caso = new ReordenarPasoWizard(env.repo as unknown as ConstructorParameters<typeof ReordenarPasoWizard>[0], env.auth as unknown as ConstructorParameters<typeof ReordenarPasoWizard>[1], env.reloj as unknown as ConstructorParameters<typeof ReordenarPasoWizard>[2])
  await assert.rejects(caso.ejecutar(contexto, 2n, antes, -1), /Orden inválido/)
  assert.equal(env.llamadas.filter(x => x.operacion === 'guardar').length, 0)
})

test('wizard: activar fuente heredada no permitida requiere corregirla antes', async () => {
  const env = entorno('PasoWizard')
  env.actual.editar({ titulo: 'Paso', descripcion: 'Descripción', fuenteDatos: 'tabla_arbitraria', campoFiltro: null }, antes)
  env.actual.inactivar(antes)
  const caso = new ActivarPasoWizard(env.repo as unknown as RepositorioPasosWizard, env.auth, env.reloj, env.fuentes)
  await assert.rejects(caso.ejecutar(contexto, 2n, antes), /no permitido/)
  assert.equal(env.llamadas.filter(x => x.operacion === 'guardar').length, 0)
})
