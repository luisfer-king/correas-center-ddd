import { codigosPermisoCms } from '../permisos-cms.js'
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { entorno, entrada, contexto, actor, antes, despues } from './soporte-pruebas-cms.js'
import type { RepositorioContenidosRegistro } from '../ports/repositorio-contenido-registro.js'
import { ActivarContenidoRegistro } from '../use-cases/contenidos-registro/activar-contenido-registro.js'
import { CrearContenidoRegistro } from '../use-cases/contenidos-registro/crear-contenido-registro.js'
import { EditarContenidoRegistro } from '../use-cases/contenidos-registro/editar-contenido-registro.js'
import { EliminarContenidoRegistro } from '../use-cases/contenidos-registro/eliminar-contenido-registro.js'
import { InactivarContenidoRegistro } from '../use-cases/contenidos-registro/inactivar-contenido-registro.js'
import { ListarContenidosRegistro } from '../use-cases/contenidos-registro/listar-contenidos-registro.js'
import { ObtenerContenidoRegistro } from '../use-cases/contenidos-registro/obtener-contenido-registro.js'
import { ReordenarContenidoRegistro } from '../use-cases/contenidos-registro/reordenar-contenido-registro.js'

test('ActivarContenidoRegistro: autoriza antes de consultar o escribir', async () => {
  const env = entorno('ContenidoRegistro'); env.opciones.permitir = false; const caso = new ActivarContenidoRegistro(env.repo as unknown as RepositorioContenidosRegistro, env.auth, env.reloj)
  await assert.rejects(caso.ejecutar(contexto, 2n, antes), /Acceso denegado/)
  assert.equal(env.llamadas.length, 0)
  assert.deepEqual(env.permisos, [...codigosPermisoCms('contenidos_registro', 'manage')])
})

test('ActivarContenidoRegistro: aplica operación y conserva contexto/versión', async () => {
  const env = entorno('ContenidoRegistro'); env.actual.inactivar(antes); const caso = new ActivarContenidoRegistro(env.repo as unknown as RepositorioContenidosRegistro, env.auth, env.reloj)
  const resultado = await caso.ejecutar(contexto, 2n, antes)
  assert.equal(resultado.id, env.actual.id)
  const guardado = env.llamadas.find(x => x.operacion === 'guardar')!
  assert.equal(guardado.args[1].getTime(), antes.getTime())
  assert.equal(guardado.args[2].ipAddress, contexto.ipAddress)
  assert.equal(guardado.args[2].userAgent, contexto.userAgent)
  assert.ok(guardado.args[2].cuando > antes)
  assert.equal(resultado.estado, 'activo')
})

test('CrearContenidoRegistro: autoriza antes de consultar o escribir', async () => {
  const env = entorno('ContenidoRegistro'); env.opciones.permitir = false; const caso = new CrearContenidoRegistro(env.repo as unknown as RepositorioContenidosRegistro, env.auth, env.reloj)
  await assert.rejects(caso.ejecutar(contexto, entrada('ContenidoRegistro')), /Acceso denegado/)
  assert.equal(env.llamadas.length, 0)
  assert.deepEqual(env.permisos, [...codigosPermisoCms('contenidos_registro', 'manage')])
})

test('CrearContenidoRegistro: aplica operación y conserva contexto/versión', async () => {
  const env = entorno('ContenidoRegistro'); const caso = new CrearContenidoRegistro(env.repo as unknown as RepositorioContenidosRegistro, env.auth, env.reloj)
  const resultado = await caso.ejecutar(contexto, entrada('ContenidoRegistro'))
  assert.equal(resultado.id, 99n)
  assert.equal(env.llamadas.find(x => x.operacion === 'crear')?.args[1].actorId, actor)
})

test('EditarContenidoRegistro: autoriza antes de consultar o escribir', async () => {
  const env = entorno('ContenidoRegistro'); env.opciones.permitir = false; const caso = new EditarContenidoRegistro(env.repo as unknown as RepositorioContenidosRegistro, env.auth, env.reloj)
  await assert.rejects(caso.ejecutar(contexto, 2n, antes, entrada('ContenidoRegistro')), /Acceso denegado/)
  assert.equal(env.llamadas.length, 0)
  assert.deepEqual(env.permisos, [...codigosPermisoCms('contenidos_registro', 'manage')])
})

test('EditarContenidoRegistro: aplica operación y conserva contexto/versión', async () => {
  const env = entorno('ContenidoRegistro'); const caso = new EditarContenidoRegistro(env.repo as unknown as RepositorioContenidosRegistro, env.auth, env.reloj)
  const resultado = await caso.ejecutar(contexto, 2n, antes, entrada('ContenidoRegistro'))
  assert.equal(resultado.id, env.actual.id)
  const guardado = env.llamadas.find(x => x.operacion === 'guardar')!
  assert.equal(guardado.args[1].getTime(), antes.getTime())
  assert.equal(guardado.args[2].ipAddress, contexto.ipAddress)
  assert.equal(guardado.args[2].userAgent, contexto.userAgent)
  assert.ok(guardado.args[2].cuando > antes)
})

test('EliminarContenidoRegistro: autoriza antes de consultar o escribir', async () => {
  const env = entorno('ContenidoRegistro'); env.opciones.permitir = false; const caso = new EliminarContenidoRegistro(env.repo as unknown as RepositorioContenidosRegistro, env.auth, env.reloj)
  await assert.rejects(caso.ejecutar(contexto, 2n, antes), /Acceso denegado/)
  assert.equal(env.llamadas.length, 0)
  assert.deepEqual(env.permisos, [...codigosPermisoCms('contenidos_registro', 'manage')])
})

test('EliminarContenidoRegistro: aplica operación y conserva contexto/versión', async () => {
  const env = entorno('ContenidoRegistro'); const caso = new EliminarContenidoRegistro(env.repo as unknown as RepositorioContenidosRegistro, env.auth, env.reloj)
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

test('InactivarContenidoRegistro: autoriza antes de consultar o escribir', async () => {
  const env = entorno('ContenidoRegistro'); env.opciones.permitir = false; const caso = new InactivarContenidoRegistro(env.repo as unknown as RepositorioContenidosRegistro, env.auth, env.reloj)
  await assert.rejects(caso.ejecutar(contexto, 2n, antes), /Acceso denegado/)
  assert.equal(env.llamadas.length, 0)
  assert.deepEqual(env.permisos, [...codigosPermisoCms('contenidos_registro', 'manage')])
})

test('InactivarContenidoRegistro: aplica operación y conserva contexto/versión', async () => {
  const env = entorno('ContenidoRegistro'); const caso = new InactivarContenidoRegistro(env.repo as unknown as RepositorioContenidosRegistro, env.auth, env.reloj)
  const resultado = await caso.ejecutar(contexto, 2n, antes)
  assert.equal(resultado.id, env.actual.id)
  const guardado = env.llamadas.find(x => x.operacion === 'guardar')!
  assert.equal(guardado.args[1].getTime(), antes.getTime())
  assert.equal(guardado.args[2].ipAddress, contexto.ipAddress)
  assert.equal(guardado.args[2].userAgent, contexto.userAgent)
  assert.ok(guardado.args[2].cuando > antes)
  assert.equal(resultado.estado, 'inactivo')
})

test('ListarContenidosRegistro: autoriza antes de consultar o escribir', async () => {
  const env = entorno('ContenidoRegistro'); env.opciones.permitir = false; const caso = new ListarContenidosRegistro(env.repo as unknown as RepositorioContenidosRegistro, env.auth)
  await assert.rejects(caso.ejecutar(actor, {}), /Acceso denegado/)
  assert.equal(env.llamadas.length, 0)
  assert.deepEqual(env.permisos, [...codigosPermisoCms('contenidos_registro', 'read')])
})

test('ListarContenidosRegistro: aplica operación y conserva contexto/versión', async () => {
  const env = entorno('ContenidoRegistro'); const caso = new ListarContenidosRegistro(env.repo as unknown as RepositorioContenidosRegistro, env.auth)
  const resultado = await caso.ejecutar(actor, {})
  assert.ok(resultado)
})

test('ObtenerContenidoRegistro: autoriza antes de consultar o escribir', async () => {
  const env = entorno('ContenidoRegistro'); env.opciones.permitir = false; const caso = new ObtenerContenidoRegistro(env.repo as unknown as RepositorioContenidosRegistro, env.auth)
  await assert.rejects(caso.ejecutar(actor, 2n), /Acceso denegado/)
  assert.equal(env.llamadas.length, 0)
  assert.deepEqual(env.permisos, [...codigosPermisoCms('contenidos_registro', 'read')])
})

test('ObtenerContenidoRegistro: aplica operación y conserva contexto/versión', async () => {
  const env = entorno('ContenidoRegistro'); const caso = new ObtenerContenidoRegistro(env.repo as unknown as RepositorioContenidosRegistro, env.auth)
  const resultado = await caso.ejecutar(actor, 2n)
  assert.ok(resultado)
})

test('ReordenarContenidoRegistro: autoriza antes de consultar o escribir', async () => {
  const env = entorno('ContenidoRegistro'); env.opciones.permitir = false; const caso = new ReordenarContenidoRegistro(env.repo as unknown as RepositorioContenidosRegistro, env.auth, env.reloj)
  await assert.rejects(caso.ejecutar(contexto, 2n, antes, 4), /Acceso denegado/)
  assert.equal(env.llamadas.length, 0)
  assert.deepEqual(env.permisos, [...codigosPermisoCms('contenidos_registro', 'manage')])
})

test('ReordenarContenidoRegistro: aplica operación y conserva contexto/versión', async () => {
  const env = entorno('ContenidoRegistro'); const caso = new ReordenarContenidoRegistro(env.repo as unknown as RepositorioContenidosRegistro, env.auth, env.reloj)
  const resultado = await caso.ejecutar(contexto, 2n, antes, 4)
  assert.equal(resultado.id, env.actual.id)
  const guardado = env.llamadas.find(x => x.operacion === 'guardar')!
  assert.equal(guardado.args[1].getTime(), antes.getTime())
  assert.equal(guardado.args[2].ipAddress, contexto.ipAddress)
  assert.equal(guardado.args[2].userAgent, contexto.userAgent)
  assert.ok(guardado.args[2].cuando > antes)
  assert.equal(resultado.orden.value, 4)
})

test('ContenidoRegistro: versión obsoleta impide guardar', async () => {
  const env = entorno('ContenidoRegistro'); const caso = new EditarContenidoRegistro(env.repo as unknown as ConstructorParameters<typeof EditarContenidoRegistro>[0], env.auth as unknown as ConstructorParameters<typeof EditarContenidoRegistro>[1], env.reloj as unknown as ConstructorParameters<typeof EditarContenidoRegistro>[2])
  await assert.rejects(caso.ejecutar(contexto, 2n, despues, entrada('ContenidoRegistro')), /modificado/)
  assert.equal(env.llamadas.filter(x => x.operacion === 'guardar').length, 0)
})

test('ContenidoRegistro: creación inválida se rechaza antes de persistir', async () => {
  const env = entorno('ContenidoRegistro'); const caso = new CrearContenidoRegistro(env.repo as unknown as ConstructorParameters<typeof CrearContenidoRegistro>[0], env.auth as unknown as ConstructorParameters<typeof CrearContenidoRegistro>[1], env.reloj as unknown as ConstructorParameters<typeof CrearContenidoRegistro>[2])
  await assert.rejects(caso.ejecutar(contexto, { ...entrada('ContenidoRegistro'), campos: { titulo: 7, subtitulo: null, descripcion: null, icono: null } }))
  assert.equal(env.llamadas.filter(x => x.operacion === 'crear').length, 0)
})

test('ContenidoRegistro: baja lógica visible solo a super_admin e ineditable', async () => {
  const env = entorno('ContenidoRegistro'); env.actual.eliminar(despues); const lectura = new ObtenerContenidoRegistro(env.repo as unknown as ConstructorParameters<typeof ObtenerContenidoRegistro>[0], env.auth as unknown as ConstructorParameters<typeof ObtenerContenidoRegistro>[1])
  await assert.rejects(lectura.ejecutar(actor, 2n), /no disponible/)
  env.opciones.superAdmin = true
  assert.ok(await lectura.ejecutar(actor, 2n))
  const edicion = new EditarContenidoRegistro(env.repo as unknown as ConstructorParameters<typeof EditarContenidoRegistro>[0], env.auth as unknown as ConstructorParameters<typeof EditarContenidoRegistro>[1], env.reloj as unknown as ConstructorParameters<typeof EditarContenidoRegistro>[2])
  await assert.rejects(edicion.ejecutar(contexto, 2n, despues, entrada('ContenidoRegistro')), /no disponible/)
})

test('ContenidoRegistro: orden inválido no llega a guardar', async () => {
  const env = entorno('ContenidoRegistro'); const caso = new ReordenarContenidoRegistro(env.repo as unknown as ConstructorParameters<typeof ReordenarContenidoRegistro>[0], env.auth as unknown as ConstructorParameters<typeof ReordenarContenidoRegistro>[1], env.reloj as unknown as ConstructorParameters<typeof ReordenarContenidoRegistro>[2])
  await assert.rejects(caso.ejecutar(contexto, 2n, antes, -1), /Orden inválido/)
  assert.equal(env.llamadas.filter(x => x.operacion === 'guardar').length, 0)
})
