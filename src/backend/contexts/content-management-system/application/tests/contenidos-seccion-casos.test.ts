import assert from 'node:assert/strict'
import { test } from 'node:test'
import { entorno, entrada, contexto, actor, antes, despues } from './soporte-pruebas-cms.js'
import type { RepositorioContenidosSeccion } from '../ports/repositorio-contenido-seccion.js'
import { ActivarContenidoSeccion } from '../use-cases/contenidos-seccion/activar-contenido-seccion.js'
import { CrearContenidoSeccion } from '../use-cases/contenidos-seccion/crear-contenido-seccion.js'
import { EditarContenidoSeccion } from '../use-cases/contenidos-seccion/editar-contenido-seccion.js'
import { EliminarContenidoSeccion } from '../use-cases/contenidos-seccion/eliminar-contenido-seccion.js'
import { FijarVisibilidadContenidoSeccion } from '../use-cases/contenidos-seccion/fijar-visibilidad-contenido-seccion.js'
import { InactivarContenidoSeccion } from '../use-cases/contenidos-seccion/inactivar-contenido-seccion.js'
import { ListarContenidosSeccion } from '../use-cases/contenidos-seccion/listar-contenidos-seccion.js'
import { ObtenerContenidoSeccion } from '../use-cases/contenidos-seccion/obtener-contenido-seccion.js'
import { ReordenarContenidoSeccion } from '../use-cases/contenidos-seccion/reordenar-contenido-seccion.js'

test('ActivarContenidoSeccion: autoriza antes de consultar o escribir', async () => {
  const env = entorno('ContenidoSeccion'); env.opciones.permitir = false; const caso = new ActivarContenidoSeccion(env.repo as unknown as RepositorioContenidosSeccion, env.auth, env.reloj)
  await assert.rejects(caso.ejecutar(contexto, 2n, antes), /Acceso denegado/)
  assert.equal(env.llamadas.length, 0)
  assert.deepEqual(env.permisos, ['cms.contenidos_seccion.manage'])
})

test('ActivarContenidoSeccion: aplica operación y conserva contexto/versión', async () => {
  const env = entorno('ContenidoSeccion'); env.actual.inactivar(antes); const caso = new ActivarContenidoSeccion(env.repo as unknown as RepositorioContenidosSeccion, env.auth, env.reloj)
  const resultado = await caso.ejecutar(contexto, 2n, antes)
  assert.equal(resultado.id, env.actual.id)
  const guardado = env.llamadas.find(x => x.operacion === 'guardar')!
  assert.equal(guardado.args[1].getTime(), antes.getTime())
  assert.equal(guardado.args[2].ipAddress, contexto.ipAddress)
  assert.equal(guardado.args[2].userAgent, contexto.userAgent)
  assert.ok(guardado.args[2].cuando > antes)
  assert.equal(resultado.estado, 'activo')
})

test('CrearContenidoSeccion: autoriza antes de consultar o escribir', async () => {
  const env = entorno('ContenidoSeccion'); env.opciones.permitir = false; const caso = new CrearContenidoSeccion(env.repo as unknown as RepositorioContenidosSeccion, env.auth, env.reloj, env.tipos as unknown as ConstructorParameters<typeof CrearContenidoSeccion>[3])
  await assert.rejects(caso.ejecutar(contexto, entrada('ContenidoSeccion')), /Acceso denegado/)
  assert.equal(env.llamadas.length, 0)
  assert.deepEqual(env.permisos, ['cms.contenidos_seccion.manage'])
})

test('CrearContenidoSeccion: aplica operación y conserva contexto/versión', async () => {
  const env = entorno('ContenidoSeccion'); const caso = new CrearContenidoSeccion(env.repo as unknown as RepositorioContenidosSeccion, env.auth, env.reloj, env.tipos as unknown as ConstructorParameters<typeof CrearContenidoSeccion>[3])
  const resultado = await caso.ejecutar(contexto, entrada('ContenidoSeccion'))
  assert.equal(resultado.id, 99n)
  assert.equal(env.llamadas.find(x => x.operacion === 'crear')?.args[1].actorId, actor)
})

test('EditarContenidoSeccion: autoriza antes de consultar o escribir', async () => {
  const env = entorno('ContenidoSeccion'); env.opciones.permitir = false; const caso = new EditarContenidoSeccion(env.repo as unknown as RepositorioContenidosSeccion, env.auth, env.reloj, env.tipos as unknown as ConstructorParameters<typeof EditarContenidoSeccion>[3])
  await assert.rejects(caso.ejecutar(contexto, 2n, antes, entrada('ContenidoSeccion')), /Acceso denegado/)
  assert.equal(env.llamadas.length, 0)
  assert.deepEqual(env.permisos, ['cms.contenidos_seccion.manage'])
})

test('EditarContenidoSeccion: aplica operación y conserva contexto/versión', async () => {
  const env = entorno('ContenidoSeccion'); const caso = new EditarContenidoSeccion(env.repo as unknown as RepositorioContenidosSeccion, env.auth, env.reloj, env.tipos as unknown as ConstructorParameters<typeof EditarContenidoSeccion>[3])
  const resultado = await caso.ejecutar(contexto, 2n, antes, entrada('ContenidoSeccion'))
  assert.equal(resultado.id, env.actual.id)
  const guardado = env.llamadas.find(x => x.operacion === 'guardar')!
  assert.equal(guardado.args[1].getTime(), antes.getTime())
  assert.equal(guardado.args[2].ipAddress, contexto.ipAddress)
  assert.equal(guardado.args[2].userAgent, contexto.userAgent)
  assert.ok(guardado.args[2].cuando > antes)
})

test('EliminarContenidoSeccion: autoriza antes de consultar o escribir', async () => {
  const env = entorno('ContenidoSeccion'); env.opciones.permitir = false; const caso = new EliminarContenidoSeccion(env.repo as unknown as RepositorioContenidosSeccion, env.auth, env.reloj)
  await assert.rejects(caso.ejecutar(contexto, 2n, antes), /Acceso denegado/)
  assert.equal(env.llamadas.length, 0)
  assert.deepEqual(env.permisos, ['cms.contenidos_seccion.manage'])
})

test('EliminarContenidoSeccion: aplica operación y conserva contexto/versión', async () => {
  const env = entorno('ContenidoSeccion'); const caso = new EliminarContenidoSeccion(env.repo as unknown as RepositorioContenidosSeccion, env.auth, env.reloj)
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

test('FijarVisibilidadContenidoSeccion: autoriza antes de consultar o escribir', async () => {
  const env = entorno('ContenidoSeccion'); env.opciones.permitir = false; const caso = new FijarVisibilidadContenidoSeccion(env.repo as unknown as RepositorioContenidosSeccion, env.auth, env.reloj)
  await assert.rejects(caso.ejecutar(contexto, 2n, antes, false), /Acceso denegado/)
  assert.equal(env.llamadas.length, 0)
  assert.deepEqual(env.permisos, ['cms.contenidos_seccion.manage'])
})

test('FijarVisibilidadContenidoSeccion: aplica operación y conserva contexto/versión', async () => {
  const env = entorno('ContenidoSeccion'); const caso = new FijarVisibilidadContenidoSeccion(env.repo as unknown as RepositorioContenidosSeccion, env.auth, env.reloj)
  const resultado = await caso.ejecutar(contexto, 2n, antes, false)
  assert.equal(resultado.id, env.actual.id)
  const guardado = env.llamadas.find(x => x.operacion === 'guardar')!
  assert.equal(guardado.args[1].getTime(), antes.getTime())
  assert.equal(guardado.args[2].ipAddress, contexto.ipAddress)
  assert.equal(guardado.args[2].userAgent, contexto.userAgent)
  assert.ok(guardado.args[2].cuando > antes)
  assert.equal(resultado.mostrar, false)
})

test('InactivarContenidoSeccion: autoriza antes de consultar o escribir', async () => {
  const env = entorno('ContenidoSeccion'); env.opciones.permitir = false; const caso = new InactivarContenidoSeccion(env.repo as unknown as RepositorioContenidosSeccion, env.auth, env.reloj)
  await assert.rejects(caso.ejecutar(contexto, 2n, antes), /Acceso denegado/)
  assert.equal(env.llamadas.length, 0)
  assert.deepEqual(env.permisos, ['cms.contenidos_seccion.manage'])
})

test('InactivarContenidoSeccion: aplica operación y conserva contexto/versión', async () => {
  const env = entorno('ContenidoSeccion'); const caso = new InactivarContenidoSeccion(env.repo as unknown as RepositorioContenidosSeccion, env.auth, env.reloj)
  const resultado = await caso.ejecutar(contexto, 2n, antes)
  assert.equal(resultado.id, env.actual.id)
  const guardado = env.llamadas.find(x => x.operacion === 'guardar')!
  assert.equal(guardado.args[1].getTime(), antes.getTime())
  assert.equal(guardado.args[2].ipAddress, contexto.ipAddress)
  assert.equal(guardado.args[2].userAgent, contexto.userAgent)
  assert.ok(guardado.args[2].cuando > antes)
  assert.equal(resultado.estado, 'inactivo')
})

test('ListarContenidosSeccion: autoriza antes de consultar o escribir', async () => {
  const env = entorno('ContenidoSeccion'); env.opciones.permitir = false; const caso = new ListarContenidosSeccion(env.repo as unknown as RepositorioContenidosSeccion, env.auth)
  await assert.rejects(caso.ejecutar(actor, {}), /Acceso denegado/)
  assert.equal(env.llamadas.length, 0)
  assert.deepEqual(env.permisos, ['cms.contenidos_seccion.read'])
})

test('ListarContenidosSeccion: aplica operación y conserva contexto/versión', async () => {
  const env = entorno('ContenidoSeccion'); const caso = new ListarContenidosSeccion(env.repo as unknown as RepositorioContenidosSeccion, env.auth)
  const resultado = await caso.ejecutar(actor, {})
  assert.ok(resultado)
})

test('ObtenerContenidoSeccion: autoriza antes de consultar o escribir', async () => {
  const env = entorno('ContenidoSeccion'); env.opciones.permitir = false; const caso = new ObtenerContenidoSeccion(env.repo as unknown as RepositorioContenidosSeccion, env.auth)
  await assert.rejects(caso.ejecutar(actor, 2n), /Acceso denegado/)
  assert.equal(env.llamadas.length, 0)
  assert.deepEqual(env.permisos, ['cms.contenidos_seccion.read'])
})

test('ObtenerContenidoSeccion: aplica operación y conserva contexto/versión', async () => {
  const env = entorno('ContenidoSeccion'); const caso = new ObtenerContenidoSeccion(env.repo as unknown as RepositorioContenidosSeccion, env.auth)
  const resultado = await caso.ejecutar(actor, 2n)
  assert.ok(resultado)
})

test('ReordenarContenidoSeccion: autoriza antes de consultar o escribir', async () => {
  const env = entorno('ContenidoSeccion'); env.opciones.permitir = false; const caso = new ReordenarContenidoSeccion(env.repo as unknown as RepositorioContenidosSeccion, env.auth, env.reloj)
  await assert.rejects(caso.ejecutar(contexto, 2n, antes, 4), /Acceso denegado/)
  assert.equal(env.llamadas.length, 0)
  assert.deepEqual(env.permisos, ['cms.contenidos_seccion.manage'])
})

test('ReordenarContenidoSeccion: aplica operación y conserva contexto/versión', async () => {
  const env = entorno('ContenidoSeccion'); const caso = new ReordenarContenidoSeccion(env.repo as unknown as RepositorioContenidosSeccion, env.auth, env.reloj)
  const resultado = await caso.ejecutar(contexto, 2n, antes, 4)
  assert.equal(resultado.id, env.actual.id)
  const guardado = env.llamadas.find(x => x.operacion === 'guardar')!
  assert.equal(guardado.args[1].getTime(), antes.getTime())
  assert.equal(guardado.args[2].ipAddress, contexto.ipAddress)
  assert.equal(guardado.args[2].userAgent, contexto.userAgent)
  assert.ok(guardado.args[2].cuando > antes)
  assert.equal(resultado.orden.value, 4)
})

test('ContenidoSeccion: versión obsoleta impide guardar', async () => {
  const env = entorno('ContenidoSeccion'); const caso = new EditarContenidoSeccion(env.repo as unknown as ConstructorParameters<typeof EditarContenidoSeccion>[0], env.auth as unknown as ConstructorParameters<typeof EditarContenidoSeccion>[1], env.reloj as unknown as ConstructorParameters<typeof EditarContenidoSeccion>[2], env.tipos as unknown as ConstructorParameters<typeof EditarContenidoSeccion>[3])
  await assert.rejects(caso.ejecutar(contexto, 2n, despues, entrada('ContenidoSeccion')), /modificado/)
  assert.equal(env.llamadas.filter(x => x.operacion === 'guardar').length, 0)
})

test('ContenidoSeccion: creación inválida se rechaza antes de persistir', async () => {
  const env = entorno('ContenidoSeccion'); const caso = new CrearContenidoSeccion(env.repo as unknown as ConstructorParameters<typeof CrearContenidoSeccion>[0], env.auth as unknown as ConstructorParameters<typeof CrearContenidoSeccion>[1], env.reloj as unknown as ConstructorParameters<typeof CrearContenidoSeccion>[2], env.tipos as unknown as ConstructorParameters<typeof CrearContenidoSeccion>[3])
  await assert.rejects(caso.ejecutar(contexto, { ...entrada('ContenidoSeccion'), metadata: { noDeclarada: true } }))
  assert.equal(env.llamadas.filter(x => x.operacion === 'crear').length, 0)
})

test('ContenidoSeccion: baja lógica visible solo a super_admin e ineditable', async () => {
  const env = entorno('ContenidoSeccion'); env.actual.eliminar(despues); const lectura = new ObtenerContenidoSeccion(env.repo as unknown as ConstructorParameters<typeof ObtenerContenidoSeccion>[0], env.auth as unknown as ConstructorParameters<typeof ObtenerContenidoSeccion>[1])
  await assert.rejects(lectura.ejecutar(actor, 2n), /no disponible/)
  env.opciones.superAdmin = true
  assert.ok(await lectura.ejecutar(actor, 2n))
  const edicion = new EditarContenidoSeccion(env.repo as unknown as ConstructorParameters<typeof EditarContenidoSeccion>[0], env.auth as unknown as ConstructorParameters<typeof EditarContenidoSeccion>[1], env.reloj as unknown as ConstructorParameters<typeof EditarContenidoSeccion>[2], env.tipos as unknown as ConstructorParameters<typeof EditarContenidoSeccion>[3])
  await assert.rejects(edicion.ejecutar(contexto, 2n, despues, entrada('ContenidoSeccion')), /no disponible/)
})

test('ContenidoSeccion: orden inválido no llega a guardar', async () => {
  const env = entorno('ContenidoSeccion'); const caso = new ReordenarContenidoSeccion(env.repo as unknown as ConstructorParameters<typeof ReordenarContenidoSeccion>[0], env.auth as unknown as ConstructorParameters<typeof ReordenarContenidoSeccion>[1], env.reloj as unknown as ConstructorParameters<typeof ReordenarContenidoSeccion>[2])
  await assert.rejects(caso.ejecutar(contexto, 2n, antes, -1), /Orden inválido/)
  assert.equal(env.llamadas.filter(x => x.operacion === 'guardar').length, 0)
})
