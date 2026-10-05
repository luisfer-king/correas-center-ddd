import assert from 'node:assert/strict'
import { test } from 'node:test'
import { entorno, entrada, contexto, actor, antes, despues } from './soporte-pruebas-cms.js'
import type { RepositorioTiposSeccion } from '../ports/repositorio-tipo-seccion.js'
import { ActivarTipoSeccion } from '../use-cases/tipos-seccion/activar-tipo-seccion.js'
import { CambiarClavesTipoSeccion } from '../use-cases/tipos-seccion/cambiar-claves-tipo-seccion.js'
import { CrearTipoSeccion } from '../use-cases/tipos-seccion/crear-tipo-seccion.js'
import { EditarTipoSeccion } from '../use-cases/tipos-seccion/editar-tipo-seccion.js'
import { EliminarTipoSeccion } from '../use-cases/tipos-seccion/eliminar-tipo-seccion.js'
import { InactivarTipoSeccion } from '../use-cases/tipos-seccion/inactivar-tipo-seccion.js'
import { ListarTiposSeccion } from '../use-cases/tipos-seccion/listar-tipos-seccion.js'
import { ObtenerTipoSeccion } from '../use-cases/tipos-seccion/obtener-tipo-seccion.js'
import { ReordenarTipoSeccion } from '../use-cases/tipos-seccion/reordenar-tipo-seccion.js'

test('ActivarTipoSeccion: autoriza antes de consultar o escribir', async () => {
  const env = entorno('TipoSeccion'); env.opciones.permitir = false; const caso = new ActivarTipoSeccion(env.repo as unknown as RepositorioTiposSeccion, env.auth, env.reloj)
  await assert.rejects(caso.ejecutar(contexto, 2n, antes), /Acceso denegado/)
  assert.equal(env.llamadas.length, 0)
  assert.deepEqual(env.permisos, ['cms.tipos_seccion.manage'])
})

test('ActivarTipoSeccion: aplica operación y conserva contexto/versión', async () => {
  const env = entorno('TipoSeccion'); env.actual.inactivar(antes); const caso = new ActivarTipoSeccion(env.repo as unknown as RepositorioTiposSeccion, env.auth, env.reloj)
  const resultado = await caso.ejecutar(contexto, 2n, antes)
  assert.equal(resultado.id, env.actual.id)
  const guardado = env.llamadas.find(x => x.operacion === 'guardar')!
  assert.equal(guardado.args[1].getTime(), antes.getTime())
  assert.equal(guardado.args[2].ipAddress, contexto.ipAddress)
  assert.equal(guardado.args[2].userAgent, contexto.userAgent)
  assert.ok(guardado.args[2].cuando > antes)
  assert.equal(resultado.estado, 'activo')
})

test('CambiarClavesTipoSeccion: autoriza antes de consultar o escribir', async () => {
  const env = entorno('TipoSeccion'); env.opciones.permitir = false; const caso = new CambiarClavesTipoSeccion(env.repo as unknown as RepositorioTiposSeccion, env.auth, env.reloj)
  await assert.rejects(caso.ejecutar(contexto, 2n, antes, ['cta', 'otra']), /Acceso denegado/)
  assert.equal(env.llamadas.length, 0)
  assert.deepEqual(env.permisos, ['cms.tipos_seccion.manage'])
})

test('CambiarClavesTipoSeccion: aplica operación y conserva contexto/versión', async () => {
  const env = entorno('TipoSeccion'); const caso = new CambiarClavesTipoSeccion(env.repo as unknown as RepositorioTiposSeccion, env.auth, env.reloj)
  const resultado = await caso.ejecutar(contexto, 2n, antes, ['cta', 'otra'])
  assert.equal(resultado.id, env.actual.id)
  const guardado = env.llamadas.find(x => x.operacion === 'guardar')!
  assert.equal(guardado.args[1].getTime(), antes.getTime())
  assert.equal(guardado.args[2].ipAddress, contexto.ipAddress)
  assert.equal(guardado.args[2].userAgent, contexto.userAgent)
  assert.ok(guardado.args[2].cuando > antes)
})

test('CrearTipoSeccion: autoriza antes de consultar o escribir', async () => {
  const env = entorno('TipoSeccion'); env.opciones.permitir = false; const caso = new CrearTipoSeccion(env.repo as unknown as RepositorioTiposSeccion, env.auth, env.reloj)
  await assert.rejects(caso.ejecutar(contexto, entrada('TipoSeccion')), /Acceso denegado/)
  assert.equal(env.llamadas.length, 0)
  assert.deepEqual(env.permisos, ['cms.tipos_seccion.manage'])
})

test('CrearTipoSeccion: aplica operación y conserva contexto/versión', async () => {
  const env = entorno('TipoSeccion'); const caso = new CrearTipoSeccion(env.repo as unknown as RepositorioTiposSeccion, env.auth, env.reloj)
  const resultado = await caso.ejecutar(contexto, entrada('TipoSeccion'))
  assert.equal(resultado.id, 99n)
  assert.equal(env.llamadas.find(x => x.operacion === 'crear')?.args[1].actorId, actor)
})

test('EditarTipoSeccion: autoriza antes de consultar o escribir', async () => {
  const env = entorno('TipoSeccion'); env.opciones.permitir = false; const caso = new EditarTipoSeccion(env.repo as unknown as RepositorioTiposSeccion, env.auth, env.reloj)
  await assert.rejects(caso.ejecutar(contexto, 2n, antes, entrada('TipoSeccion')), /Acceso denegado/)
  assert.equal(env.llamadas.length, 0)
  assert.deepEqual(env.permisos, ['cms.tipos_seccion.manage'])
})

test('EditarTipoSeccion: aplica operación y conserva contexto/versión', async () => {
  const env = entorno('TipoSeccion'); const caso = new EditarTipoSeccion(env.repo as unknown as RepositorioTiposSeccion, env.auth, env.reloj)
  const resultado = await caso.ejecutar(contexto, 2n, antes, entrada('TipoSeccion'))
  assert.equal(resultado.id, env.actual.id)
  const guardado = env.llamadas.find(x => x.operacion === 'guardar')!
  assert.equal(guardado.args[1].getTime(), antes.getTime())
  assert.equal(guardado.args[2].ipAddress, contexto.ipAddress)
  assert.equal(guardado.args[2].userAgent, contexto.userAgent)
  assert.ok(guardado.args[2].cuando > antes)
})

test('EliminarTipoSeccion: autoriza antes de consultar o escribir', async () => {
  const env = entorno('TipoSeccion'); env.opciones.permitir = false; const caso = new EliminarTipoSeccion(env.repo as unknown as RepositorioTiposSeccion, env.auth, env.reloj)
  await assert.rejects(caso.ejecutar(contexto, 2n, antes), /Acceso denegado/)
  assert.equal(env.llamadas.length, 0)
  assert.deepEqual(env.permisos, ['cms.tipos_seccion.manage'])
})

test('EliminarTipoSeccion: aplica operación y conserva contexto/versión', async () => {
  const env = entorno('TipoSeccion'); const caso = new EliminarTipoSeccion(env.repo as unknown as RepositorioTiposSeccion, env.auth, env.reloj)
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

test('InactivarTipoSeccion: autoriza antes de consultar o escribir', async () => {
  const env = entorno('TipoSeccion'); env.opciones.permitir = false; const caso = new InactivarTipoSeccion(env.repo as unknown as RepositorioTiposSeccion, env.auth, env.reloj)
  await assert.rejects(caso.ejecutar(contexto, 2n, antes), /Acceso denegado/)
  assert.equal(env.llamadas.length, 0)
  assert.deepEqual(env.permisos, ['cms.tipos_seccion.manage'])
})

test('InactivarTipoSeccion: aplica operación y conserva contexto/versión', async () => {
  const env = entorno('TipoSeccion'); const caso = new InactivarTipoSeccion(env.repo as unknown as RepositorioTiposSeccion, env.auth, env.reloj)
  const resultado = await caso.ejecutar(contexto, 2n, antes)
  assert.equal(resultado.id, env.actual.id)
  const guardado = env.llamadas.find(x => x.operacion === 'guardar')!
  assert.equal(guardado.args[1].getTime(), antes.getTime())
  assert.equal(guardado.args[2].ipAddress, contexto.ipAddress)
  assert.equal(guardado.args[2].userAgent, contexto.userAgent)
  assert.ok(guardado.args[2].cuando > antes)
  assert.equal(resultado.estado, 'inactivo')
})

test('ListarTiposSeccion: autoriza antes de consultar o escribir', async () => {
  const env = entorno('TipoSeccion'); env.opciones.permitir = false; const caso = new ListarTiposSeccion(env.repo as unknown as RepositorioTiposSeccion, env.auth)
  await assert.rejects(caso.ejecutar(actor, {}), /Acceso denegado/)
  assert.equal(env.llamadas.length, 0)
  assert.deepEqual(env.permisos, ['cms.tipos_seccion.read'])
})

test('ListarTiposSeccion: aplica operación y conserva contexto/versión', async () => {
  const env = entorno('TipoSeccion'); const caso = new ListarTiposSeccion(env.repo as unknown as RepositorioTiposSeccion, env.auth)
  const resultado = await caso.ejecutar(actor, {})
  assert.ok(resultado)
})

test('ObtenerTipoSeccion: autoriza antes de consultar o escribir', async () => {
  const env = entorno('TipoSeccion'); env.opciones.permitir = false; const caso = new ObtenerTipoSeccion(env.repo as unknown as RepositorioTiposSeccion, env.auth)
  await assert.rejects(caso.ejecutar(actor, 2n), /Acceso denegado/)
  assert.equal(env.llamadas.length, 0)
  assert.deepEqual(env.permisos, ['cms.tipos_seccion.read'])
})

test('ObtenerTipoSeccion: aplica operación y conserva contexto/versión', async () => {
  const env = entorno('TipoSeccion'); const caso = new ObtenerTipoSeccion(env.repo as unknown as RepositorioTiposSeccion, env.auth)
  const resultado = await caso.ejecutar(actor, 2n)
  assert.ok(resultado)
})

test('ReordenarTipoSeccion: autoriza antes de consultar o escribir', async () => {
  const env = entorno('TipoSeccion'); env.opciones.permitir = false; const caso = new ReordenarTipoSeccion(env.repo as unknown as RepositorioTiposSeccion, env.auth, env.reloj)
  await assert.rejects(caso.ejecutar(contexto, 2n, antes, 4), /Acceso denegado/)
  assert.equal(env.llamadas.length, 0)
  assert.deepEqual(env.permisos, ['cms.tipos_seccion.manage'])
})

test('ReordenarTipoSeccion: aplica operación y conserva contexto/versión', async () => {
  const env = entorno('TipoSeccion'); const caso = new ReordenarTipoSeccion(env.repo as unknown as RepositorioTiposSeccion, env.auth, env.reloj)
  const resultado = await caso.ejecutar(contexto, 2n, antes, 4)
  assert.equal(resultado.id, env.actual.id)
  const guardado = env.llamadas.find(x => x.operacion === 'guardar')!
  assert.equal(guardado.args[1].getTime(), antes.getTime())
  assert.equal(guardado.args[2].ipAddress, contexto.ipAddress)
  assert.equal(guardado.args[2].userAgent, contexto.userAgent)
  assert.ok(guardado.args[2].cuando > antes)
  assert.equal(resultado.orden.value, 4)
})

test('TipoSeccion: versión obsoleta impide guardar', async () => {
  const env = entorno('TipoSeccion'); const caso = new EditarTipoSeccion(env.repo as unknown as ConstructorParameters<typeof EditarTipoSeccion>[0], env.auth as unknown as ConstructorParameters<typeof EditarTipoSeccion>[1], env.reloj as unknown as ConstructorParameters<typeof EditarTipoSeccion>[2])
  await assert.rejects(caso.ejecutar(contexto, 2n, despues, entrada('TipoSeccion')), /modificado/)
  assert.equal(env.llamadas.filter(x => x.operacion === 'guardar').length, 0)
})

test('TipoSeccion: creación inválida se rechaza antes de persistir', async () => {
  const env = entorno('TipoSeccion'); const caso = new CrearTipoSeccion(env.repo as unknown as ConstructorParameters<typeof CrearTipoSeccion>[0], env.auth as unknown as ConstructorParameters<typeof CrearTipoSeccion>[1], env.reloj as unknown as ConstructorParameters<typeof CrearTipoSeccion>[2])
  await assert.rejects(caso.ejecutar(contexto, { ...entrada('TipoSeccion'), nombre: '' }))
  assert.equal(env.llamadas.filter(x => x.operacion === 'crear').length, 0)
})

test('TipoSeccion: baja lógica visible solo a super_admin e ineditable', async () => {
  const env = entorno('TipoSeccion'); env.actual.eliminar(despues); const lectura = new ObtenerTipoSeccion(env.repo as unknown as ConstructorParameters<typeof ObtenerTipoSeccion>[0], env.auth as unknown as ConstructorParameters<typeof ObtenerTipoSeccion>[1])
  await assert.rejects(lectura.ejecutar(actor, 2n), /no disponible/)
  env.opciones.superAdmin = true
  assert.ok(await lectura.ejecutar(actor, 2n))
  const edicion = new EditarTipoSeccion(env.repo as unknown as ConstructorParameters<typeof EditarTipoSeccion>[0], env.auth as unknown as ConstructorParameters<typeof EditarTipoSeccion>[1], env.reloj as unknown as ConstructorParameters<typeof EditarTipoSeccion>[2])
  await assert.rejects(edicion.ejecutar(contexto, 2n, despues, entrada('TipoSeccion')), /no disponible/)
})

test('TipoSeccion: orden inválido no llega a guardar', async () => {
  const env = entorno('TipoSeccion'); const caso = new ReordenarTipoSeccion(env.repo as unknown as ConstructorParameters<typeof ReordenarTipoSeccion>[0], env.auth as unknown as ConstructorParameters<typeof ReordenarTipoSeccion>[1], env.reloj as unknown as ConstructorParameters<typeof ReordenarTipoSeccion>[2])
  await assert.rejects(caso.ejecutar(contexto, 2n, antes, -1), /Orden inválido/)
  assert.equal(env.llamadas.filter(x => x.operacion === 'guardar').length, 0)
})
