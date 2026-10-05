import assert from 'node:assert/strict'
import { test } from 'node:test'
import { entorno, entrada, contexto, actor, antes, despues } from './soporte-pruebas-cms.js'
import type { RepositorioConfiguracionesSitio } from '../ports/repositorio-configuracion-sitio.js'
import { CambiarActividadConfiguracionSitio } from '../use-cases/configuracion-sitio/cambiar-actividad-configuracion-sitio.js'
import { CrearConfiguracionSitio } from '../use-cases/configuracion-sitio/crear-configuracion-sitio.js'
import { EditarConfiguracionSitio } from '../use-cases/configuracion-sitio/editar-configuracion-sitio.js'
import { ListarConfiguracionesSitio } from '../use-cases/configuracion-sitio/listar-configuracion-sitio.js'
import { ObtenerConfiguracionSitio } from '../use-cases/configuracion-sitio/obtener-configuracion-sitio.js'

test('CambiarActividadConfiguracionSitio: autoriza antes de consultar o escribir', async () => {
  const env = entorno('ConfiguracionSitio'); env.opciones.permitir = false; const caso = new CambiarActividadConfiguracionSitio(env.repo as unknown as RepositorioConfiguracionesSitio, env.auth, env.reloj)
  await assert.rejects(caso.ejecutar(contexto, 2, antes, true), /Acceso denegado/)
  assert.equal(env.llamadas.length, 0)
  assert.deepEqual(env.permisos, ['cms.configuracion_sitio.manage'])
})

test('CambiarActividadConfiguracionSitio: aplica operación y conserva contexto/versión', async () => {
  const env = entorno('ConfiguracionSitio'); const caso = new CambiarActividadConfiguracionSitio(env.repo as unknown as RepositorioConfiguracionesSitio, env.auth, env.reloj)
  const resultado = await caso.ejecutar(contexto, 2, antes, true)
  assert.equal(resultado.id, env.actual.id)
  const guardado = env.llamadas.find(x => x.operacion === 'guardar')!
  assert.equal(guardado.args[1].getTime(), antes.getTime())
  assert.equal(guardado.args[2].ipAddress, contexto.ipAddress)
  assert.equal(guardado.args[2].userAgent, contexto.userAgent)
  assert.ok(guardado.args[2].cuando > antes)
})

test('CrearConfiguracionSitio: autoriza antes de consultar o escribir', async () => {
  const env = entorno('ConfiguracionSitio'); env.opciones.permitir = false; const caso = new CrearConfiguracionSitio(env.repo as unknown as RepositorioConfiguracionesSitio, env.auth, env.reloj)
  await assert.rejects(caso.ejecutar(contexto, entrada('ConfiguracionSitio')), /Acceso denegado/)
  assert.equal(env.llamadas.length, 0)
  assert.deepEqual(env.permisos, ['cms.configuracion_sitio.manage'])
})

test('CrearConfiguracionSitio: aplica operación y conserva contexto/versión', async () => {
  const env = entorno('ConfiguracionSitio'); const caso = new CrearConfiguracionSitio(env.repo as unknown as RepositorioConfiguracionesSitio, env.auth, env.reloj)
  const resultado = await caso.ejecutar(contexto, entrada('ConfiguracionSitio'))
  assert.equal(resultado.id, 99)
  assert.equal(env.llamadas.find(x => x.operacion === 'crear')?.args[1].actorId, actor)
})

test('EditarConfiguracionSitio: autoriza antes de consultar o escribir', async () => {
  const env = entorno('ConfiguracionSitio'); env.opciones.permitir = false; const caso = new EditarConfiguracionSitio(env.repo as unknown as RepositorioConfiguracionesSitio, env.auth, env.reloj)
  await assert.rejects(caso.ejecutar(contexto, 2, antes, entrada('ConfiguracionSitio')), /Acceso denegado/)
  assert.equal(env.llamadas.length, 0)
  assert.deepEqual(env.permisos, ['cms.configuracion_sitio.manage'])
})

test('EditarConfiguracionSitio: aplica operación y conserva contexto/versión', async () => {
  const env = entorno('ConfiguracionSitio'); const caso = new EditarConfiguracionSitio(env.repo as unknown as RepositorioConfiguracionesSitio, env.auth, env.reloj)
  const resultado = await caso.ejecutar(contexto, 2, antes, entrada('ConfiguracionSitio'))
  assert.equal(resultado.id, env.actual.id)
  const guardado = env.llamadas.find(x => x.operacion === 'guardar')!
  assert.equal(guardado.args[1].getTime(), antes.getTime())
  assert.equal(guardado.args[2].ipAddress, contexto.ipAddress)
  assert.equal(guardado.args[2].userAgent, contexto.userAgent)
  assert.ok(guardado.args[2].cuando > antes)
})

test('ListarConfiguracionesSitio: autoriza antes de consultar o escribir', async () => {
  const env = entorno('ConfiguracionSitio'); env.opciones.permitir = false; const caso = new ListarConfiguracionesSitio(env.repo as unknown as RepositorioConfiguracionesSitio, env.auth)
  await assert.rejects(caso.ejecutar(actor, {}), /Acceso denegado/)
  assert.equal(env.llamadas.length, 0)
  assert.deepEqual(env.permisos, ['cms.configuracion_sitio.read'])
})

test('ListarConfiguracionesSitio: aplica operación y conserva contexto/versión', async () => {
  const env = entorno('ConfiguracionSitio'); const caso = new ListarConfiguracionesSitio(env.repo as unknown as RepositorioConfiguracionesSitio, env.auth)
  const resultado = await caso.ejecutar(actor, {})
  assert.ok(resultado)
})

test('ObtenerConfiguracionSitio: autoriza antes de consultar o escribir', async () => {
  const env = entorno('ConfiguracionSitio'); env.opciones.permitir = false; const caso = new ObtenerConfiguracionSitio(env.repo as unknown as RepositorioConfiguracionesSitio, env.auth)
  await assert.rejects(caso.ejecutar(actor, 2), /Acceso denegado/)
  assert.equal(env.llamadas.length, 0)
  assert.deepEqual(env.permisos, ['cms.configuracion_sitio.read'])
})

test('ObtenerConfiguracionSitio: aplica operación y conserva contexto/versión', async () => {
  const env = entorno('ConfiguracionSitio'); const caso = new ObtenerConfiguracionSitio(env.repo as unknown as RepositorioConfiguracionesSitio, env.auth)
  const resultado = await caso.ejecutar(actor, 2)
  assert.ok(resultado)
})

test('ConfiguracionSitio: versión obsoleta impide guardar', async () => {
  const env = entorno('ConfiguracionSitio'); const caso = new EditarConfiguracionSitio(env.repo as unknown as ConstructorParameters<typeof EditarConfiguracionSitio>[0], env.auth as unknown as ConstructorParameters<typeof EditarConfiguracionSitio>[1], env.reloj as unknown as ConstructorParameters<typeof EditarConfiguracionSitio>[2])
  await assert.rejects(caso.ejecutar(contexto, 2, despues, entrada('ConfiguracionSitio')), /modificado/)
  assert.equal(env.llamadas.filter(x => x.operacion === 'guardar').length, 0)
})

test('ConfiguracionSitio: creación inválida se rechaza antes de persistir', async () => {
  const env = entorno('ConfiguracionSitio'); const caso = new CrearConfiguracionSitio(env.repo as unknown as ConstructorParameters<typeof CrearConfiguracionSitio>[0], env.auth as unknown as ConstructorParameters<typeof CrearConfiguracionSitio>[1], env.reloj as unknown as ConstructorParameters<typeof CrearConfiguracionSitio>[2])
  await assert.rejects(caso.ejecutar(contexto, { ...entrada('ConfiguracionSitio'), clave: '' }))
  assert.equal(env.llamadas.filter(x => x.operacion === 'crear').length, 0)
})

test('configuración: editar admite versión previa nullable', async () => {
  const env = entorno('ConfiguracionSitio'); const Ctor = env.actual.constructor
  const cfg = new Ctor({ ...entrada('ConfiguracionSitio'), id: 2, creadoEn: null, actualizadoEn: null })
  let versionGuardada: Date | null | undefined = undefined
  const repo = { obtener: async () => cfg, guardar: async (_entidad: unknown, version: Date | null) => { versionGuardada = version } }
  const caso = new EditarConfiguracionSitio(repo as unknown as RepositorioConfiguracionesSitio, env.auth, env.reloj)
  const resultado = await caso.ejecutar(contexto, 2, null, entrada('ConfiguracionSitio'))
  assert.equal(versionGuardada, null)
  assert.equal(resultado.actualizadoEn?.getTime(), antes.getTime())
})
