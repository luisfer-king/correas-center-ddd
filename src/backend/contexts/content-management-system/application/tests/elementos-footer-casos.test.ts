import { codigosPermisoCms } from '../permisos-cms.js'
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { entorno, entrada, contexto, actor, antes, despues } from './soporte-pruebas-cms.js'
import type { RepositorioElementosFooter } from '../ports/repositorio-footer-elemento.js'
import { ActivarFooterElemento } from '../use-cases/elementos-footer/activar-footer-elemento.js'
import { CrearFooterElemento } from '../use-cases/elementos-footer/crear-footer-elemento.js'
import { EditarFooterElemento } from '../use-cases/elementos-footer/editar-footer-elemento.js'
import { EliminarFooterElemento } from '../use-cases/elementos-footer/eliminar-footer-elemento.js'
import { FijarVisibilidadFooterElemento } from '../use-cases/elementos-footer/fijar-visibilidad-footer-elemento.js'
import { InactivarFooterElemento } from '../use-cases/elementos-footer/inactivar-footer-elemento.js'
import { ListarElementosFooter } from '../use-cases/elementos-footer/listar-elementos-footer.js'
import { ObtenerFooterElemento } from '../use-cases/elementos-footer/obtener-footer-elemento.js'
import { ReordenarFooterElemento } from '../use-cases/elementos-footer/reordenar-footer-elemento.js'

test('ActivarFooterElemento: autoriza antes de consultar o escribir', async () => {
  const env = entorno('FooterElemento'); env.opciones.permitir = false; const caso = new ActivarFooterElemento(env.repo as unknown as RepositorioElementosFooter, env.auth, env.reloj)
  await assert.rejects(caso.ejecutar(contexto, 2n, antes), /Acceso denegado/)
  assert.equal(env.llamadas.length, 0)
  assert.deepEqual(env.permisos, [...codigosPermisoCms('elementos_footer', 'manage')])
})

test('ActivarFooterElemento: aplica operación y conserva contexto/versión', async () => {
  const env = entorno('FooterElemento'); env.actual.inactivar(antes); const caso = new ActivarFooterElemento(env.repo as unknown as RepositorioElementosFooter, env.auth, env.reloj)
  const resultado = await caso.ejecutar(contexto, 2n, antes)
  assert.equal(resultado.id, env.actual.id)
  const guardado = env.llamadas.find(x => x.operacion === 'guardar')!
  assert.equal(guardado.args[1].getTime(), antes.getTime())
  assert.equal(guardado.args[2].ipAddress, contexto.ipAddress)
  assert.equal(guardado.args[2].userAgent, contexto.userAgent)
  assert.ok(guardado.args[2].cuando > antes)
  assert.equal(resultado.estado, 'activo')
})

test('CrearFooterElemento: autoriza antes de consultar o escribir', async () => {
  const env = entorno('FooterElemento'); env.opciones.permitir = false; const caso = new CrearFooterElemento(env.repo as unknown as RepositorioElementosFooter, env.auth, env.reloj)
  await assert.rejects(caso.ejecutar(contexto, entrada('FooterElemento')), /Acceso denegado/)
  assert.equal(env.llamadas.length, 0)
  assert.deepEqual(env.permisos, [...codigosPermisoCms('elementos_footer', 'manage')])
})

test('CrearFooterElemento: aplica operación y conserva contexto/versión', async () => {
  const env = entorno('FooterElemento'); const caso = new CrearFooterElemento(env.repo as unknown as RepositorioElementosFooter, env.auth, env.reloj)
  const resultado = await caso.ejecutar(contexto, entrada('FooterElemento'))
  assert.equal(resultado.id, 99n)
  assert.equal(env.llamadas.find(x => x.operacion === 'crear')?.args[1].actorId, actor)
})

test('EditarFooterElemento: autoriza antes de consultar o escribir', async () => {
  const env = entorno('FooterElemento'); env.opciones.permitir = false; const caso = new EditarFooterElemento(env.repo as unknown as RepositorioElementosFooter, env.auth, env.reloj)
  await assert.rejects(caso.ejecutar(contexto, 2n, antes, entrada('FooterElemento')), /Acceso denegado/)
  assert.equal(env.llamadas.length, 0)
  assert.deepEqual(env.permisos, [...codigosPermisoCms('elementos_footer', 'manage')])
})

test('EditarFooterElemento: aplica operación y conserva contexto/versión', async () => {
  const env = entorno('FooterElemento'); const caso = new EditarFooterElemento(env.repo as unknown as RepositorioElementosFooter, env.auth, env.reloj)
  const resultado = await caso.ejecutar(contexto, 2n, antes, entrada('FooterElemento'))
  assert.equal(resultado.id, env.actual.id)
  const guardado = env.llamadas.find(x => x.operacion === 'guardar')!
  assert.equal(guardado.args[1].getTime(), antes.getTime())
  assert.equal(guardado.args[2].ipAddress, contexto.ipAddress)
  assert.equal(guardado.args[2].userAgent, contexto.userAgent)
  assert.ok(guardado.args[2].cuando > antes)
})

test('EliminarFooterElemento: autoriza antes de consultar o escribir', async () => {
  const env = entorno('FooterElemento'); env.opciones.permitir = false; const caso = new EliminarFooterElemento(env.repo as unknown as RepositorioElementosFooter, env.auth, env.reloj)
  await assert.rejects(caso.ejecutar(contexto, 2n, antes), /Acceso denegado/)
  assert.equal(env.llamadas.length, 0)
  assert.deepEqual(env.permisos, [...codigosPermisoCms('elementos_footer', 'manage')])
})

test('EliminarFooterElemento: aplica operación y conserva contexto/versión', async () => {
  const env = entorno('FooterElemento'); const caso = new EliminarFooterElemento(env.repo as unknown as RepositorioElementosFooter, env.auth, env.reloj)
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

test('FijarVisibilidadFooterElemento: autoriza antes de consultar o escribir', async () => {
  const env = entorno('FooterElemento'); env.opciones.permitir = false; const caso = new FijarVisibilidadFooterElemento(env.repo as unknown as RepositorioElementosFooter, env.auth, env.reloj)
  await assert.rejects(caso.ejecutar(contexto, 2n, antes, false), /Acceso denegado/)
  assert.equal(env.llamadas.length, 0)
  assert.deepEqual(env.permisos, [...codigosPermisoCms('elementos_footer', 'manage')])
})

test('FijarVisibilidadFooterElemento: aplica operación y conserva contexto/versión', async () => {
  const env = entorno('FooterElemento'); const caso = new FijarVisibilidadFooterElemento(env.repo as unknown as RepositorioElementosFooter, env.auth, env.reloj)
  const resultado = await caso.ejecutar(contexto, 2n, antes, false)
  assert.equal(resultado.id, env.actual.id)
  const guardado = env.llamadas.find(x => x.operacion === 'guardar')!
  assert.equal(guardado.args[1].getTime(), antes.getTime())
  assert.equal(guardado.args[2].ipAddress, contexto.ipAddress)
  assert.equal(guardado.args[2].userAgent, contexto.userAgent)
  assert.ok(guardado.args[2].cuando > antes)
  assert.equal(resultado.mostrar, false)
})

test('InactivarFooterElemento: autoriza antes de consultar o escribir', async () => {
  const env = entorno('FooterElemento'); env.opciones.permitir = false; const caso = new InactivarFooterElemento(env.repo as unknown as RepositorioElementosFooter, env.auth, env.reloj)
  await assert.rejects(caso.ejecutar(contexto, 2n, antes), /Acceso denegado/)
  assert.equal(env.llamadas.length, 0)
  assert.deepEqual(env.permisos, [...codigosPermisoCms('elementos_footer', 'manage')])
})

test('InactivarFooterElemento: aplica operación y conserva contexto/versión', async () => {
  const env = entorno('FooterElemento'); const caso = new InactivarFooterElemento(env.repo as unknown as RepositorioElementosFooter, env.auth, env.reloj)
  const resultado = await caso.ejecutar(contexto, 2n, antes)
  assert.equal(resultado.id, env.actual.id)
  const guardado = env.llamadas.find(x => x.operacion === 'guardar')!
  assert.equal(guardado.args[1].getTime(), antes.getTime())
  assert.equal(guardado.args[2].ipAddress, contexto.ipAddress)
  assert.equal(guardado.args[2].userAgent, contexto.userAgent)
  assert.ok(guardado.args[2].cuando > antes)
  assert.equal(resultado.estado, 'inactivo')
})

test('ListarElementosFooter: autoriza antes de consultar o escribir', async () => {
  const env = entorno('FooterElemento'); env.opciones.permitir = false; const caso = new ListarElementosFooter(env.repo as unknown as RepositorioElementosFooter, env.auth)
  await assert.rejects(caso.ejecutar(actor, {}), /Acceso denegado/)
  assert.equal(env.llamadas.length, 0)
  assert.deepEqual(env.permisos, [...codigosPermisoCms('elementos_footer', 'read')])
})

test('ListarElementosFooter: aplica operación y conserva contexto/versión', async () => {
  const env = entorno('FooterElemento'); const caso = new ListarElementosFooter(env.repo as unknown as RepositorioElementosFooter, env.auth)
  const resultado = await caso.ejecutar(actor, {})
  assert.ok(resultado)
})

test('ObtenerFooterElemento: autoriza antes de consultar o escribir', async () => {
  const env = entorno('FooterElemento'); env.opciones.permitir = false; const caso = new ObtenerFooterElemento(env.repo as unknown as RepositorioElementosFooter, env.auth)
  await assert.rejects(caso.ejecutar(actor, 2n), /Acceso denegado/)
  assert.equal(env.llamadas.length, 0)
  assert.deepEqual(env.permisos, [...codigosPermisoCms('elementos_footer', 'read')])
})

test('ObtenerFooterElemento: aplica operación y conserva contexto/versión', async () => {
  const env = entorno('FooterElemento'); const caso = new ObtenerFooterElemento(env.repo as unknown as RepositorioElementosFooter, env.auth)
  const resultado = await caso.ejecutar(actor, 2n)
  assert.ok(resultado)
})

test('ReordenarFooterElemento: autoriza antes de consultar o escribir', async () => {
  const env = entorno('FooterElemento'); env.opciones.permitir = false; const caso = new ReordenarFooterElemento(env.repo as unknown as RepositorioElementosFooter, env.auth, env.reloj)
  await assert.rejects(caso.ejecutar(contexto, 2n, antes, 4), /Acceso denegado/)
  assert.equal(env.llamadas.length, 0)
  assert.deepEqual(env.permisos, [...codigosPermisoCms('elementos_footer', 'manage')])
})

test('ReordenarFooterElemento: aplica operación y conserva contexto/versión', async () => {
  const env = entorno('FooterElemento'); const caso = new ReordenarFooterElemento(env.repo as unknown as RepositorioElementosFooter, env.auth, env.reloj)
  const resultado = await caso.ejecutar(contexto, 2n, antes, 4)
  assert.equal(resultado.id, env.actual.id)
  const guardado = env.llamadas.find(x => x.operacion === 'guardar')!
  assert.equal(guardado.args[1].getTime(), antes.getTime())
  assert.equal(guardado.args[2].ipAddress, contexto.ipAddress)
  assert.equal(guardado.args[2].userAgent, contexto.userAgent)
  assert.ok(guardado.args[2].cuando > antes)
  assert.equal(resultado.orden.value, 4)
})

test('FooterElemento: versión obsoleta impide guardar', async () => {
  const env = entorno('FooterElemento'); const caso = new EditarFooterElemento(env.repo as unknown as ConstructorParameters<typeof EditarFooterElemento>[0], env.auth as unknown as ConstructorParameters<typeof EditarFooterElemento>[1], env.reloj as unknown as ConstructorParameters<typeof EditarFooterElemento>[2])
  await assert.rejects(caso.ejecutar(contexto, 2n, despues, entrada('FooterElemento')), /modificado/)
  assert.equal(env.llamadas.filter(x => x.operacion === 'guardar').length, 0)
})

test('FooterElemento: creación inválida se rechaza antes de persistir', async () => {
  const env = entorno('FooterElemento'); const caso = new CrearFooterElemento(env.repo as unknown as ConstructorParameters<typeof CrearFooterElemento>[0], env.auth as unknown as ConstructorParameters<typeof CrearFooterElemento>[1], env.reloj as unknown as ConstructorParameters<typeof CrearFooterElemento>[2])
  await assert.rejects(caso.ejecutar(contexto, { ...entrada('FooterElemento'), tipo: 'red_social', destino: null, enlace: 'javascript:alert(1)' }))
  assert.equal(env.llamadas.filter(x => x.operacion === 'crear').length, 0)
})

test('FooterElemento: baja lógica visible solo a super_admin e ineditable', async () => {
  const env = entorno('FooterElemento'); env.actual.eliminar(despues); const lectura = new ObtenerFooterElemento(env.repo as unknown as ConstructorParameters<typeof ObtenerFooterElemento>[0], env.auth as unknown as ConstructorParameters<typeof ObtenerFooterElemento>[1])
  await assert.rejects(lectura.ejecutar(actor, 2n), /no disponible/)
  env.opciones.superAdmin = true
  assert.ok(await lectura.ejecutar(actor, 2n))
  const edicion = new EditarFooterElemento(env.repo as unknown as ConstructorParameters<typeof EditarFooterElemento>[0], env.auth as unknown as ConstructorParameters<typeof EditarFooterElemento>[1], env.reloj as unknown as ConstructorParameters<typeof EditarFooterElemento>[2])
  await assert.rejects(edicion.ejecutar(contexto, 2n, despues, entrada('FooterElemento')), /no disponible/)
})

test('FooterElemento: orden inválido no llega a guardar', async () => {
  const env = entorno('FooterElemento'); const caso = new ReordenarFooterElemento(env.repo as unknown as ConstructorParameters<typeof ReordenarFooterElemento>[0], env.auth as unknown as ConstructorParameters<typeof ReordenarFooterElemento>[1], env.reloj as unknown as ConstructorParameters<typeof ReordenarFooterElemento>[2])
  await assert.rejects(caso.ejecutar(contexto, 2n, antes, -1), /Orden inválido/)
  assert.equal(env.llamadas.filter(x => x.operacion === 'guardar').length, 0)
})
