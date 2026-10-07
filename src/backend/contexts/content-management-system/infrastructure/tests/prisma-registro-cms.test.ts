import assert from 'node:assert/strict'
import { test } from 'node:test'
import { PrismaRegistrosCMS } from '../prisma-registro-cms.js'
import { mapearRegistroCMS } from '../mappers/registro-cms.js'
import { entorno, contexto, antes, despues } from './soporte-pruebas-cms.js'

test('registros-cms: permiso revocado impide escribir y auditar', async () => {
  const env = entorno('registroCMS'); env.opciones.permiso = false
  const e = mapearRegistroCMS(env.fila() as Parameters<typeof mapearRegistroCMS>[0]); e.editar('Nuevo', null, despues)
  await assert.rejects(new PrismaRegistrosCMS(env.db).guardar(e, antes, contexto), /Acceso denegado/)
  assert.equal(env.consultas.filter(x => x.metodo === 'updateMany').length, 0)
  assert.equal(env.auditorias.length, 0)
})

test('registros-cms: versión obsoleta no cambia ni audita', async () => {
  const env = entorno('registroCMS'); const e = mapearRegistroCMS(env.fila() as Parameters<typeof mapearRegistroCMS>[0]); e.editar('Nuevo', null, despues)
  await assert.rejects(new PrismaRegistrosCMS(env.db).guardar(e, new Date(antes.getTime()-1), contexto), /modificad/)
  assert.equal(env.auditorias.length, 0)
  assert.equal(env.fila().actualizadoEn.getTime(), antes.getTime())
})

test('registros-cms: guardar usa Serializable, CAS, permiso y auditoría IAM', async () => {
  const env = entorno('registroCMS'); const e = mapearRegistroCMS(env.fila() as Parameters<typeof mapearRegistroCMS>[0]); e.editar('Nuevo', null, despues)
  await new PrismaRegistrosCMS(env.db).guardar(e, antes, contexto)
  assert.equal(env.fila().actualizadoEn.getTime(), despues.getTime())
  assert.equal(env.consultas[0].args.isolationLevel, 'Serializable')
  assert.ok(JSON.stringify(env.consultas.find(x => x.modelo === 'perfil')?.args).includes('cms.registros_cms.manage'))
  const actualizacion = env.consultas.find(x => x.modelo === 'registroCMS' && x.metodo === 'updateMany')!
  assert.equal(actualizacion.args.where.actualizadoEn.getTime(), antes.getTime())
  assert.equal(env.auditorias.length, 1)
  assert.ok(env.auditorias[0].includes('127.0.0.1'))
  assert.ok(env.auditorias[0].includes('registros'))
})

test('registros-cms: un fallo de auditoría revierte el cambio', async () => {
  const env = entorno('registroCMS'); env.opciones.fallarAuditoria = true
  const e = mapearRegistroCMS(env.fila() as Parameters<typeof mapearRegistroCMS>[0]); e.editar('Nuevo', null, despues)
  await assert.rejects(new PrismaRegistrosCMS(env.db).guardar(e, antes, contexto), /Fallo auditoría/)
  assert.equal(env.fila().actualizadoEn.getTime(), antes.getTime())
  assert.equal(env.auditorias.length, 0)
})

test('registros-cms: el resultado CAS cero impide auditoría', async () => {
  const env = entorno('registroCMS'); env.opciones.fallarCambio = true
  const e = mapearRegistroCMS(env.fila() as Parameters<typeof mapearRegistroCMS>[0]); e.editar('Nuevo', null, despues)
  await assert.rejects(new PrismaRegistrosCMS(env.db).guardar(e, antes, contexto), /modificad/)
  assert.equal(env.auditorias.length, 0)
})

function datosParaCrear(env: ReturnType<typeof entorno>) {
  const e = mapearRegistroCMS(env.fila() as Parameters<typeof mapearRegistroCMS>[0])
  return { identificador: e.identificador, nombre: e.nombre, descripcion: e.descripcion, orden: e.orden }
}

test('registros-cms: crear genera ID, fecha y auditoría', async () => {
  const env = entorno('registroCMS')
  const resultado = await new PrismaRegistrosCMS(env.db).crear(datosParaCrear(env), contexto)
  assert.equal(resultado.id, 99n)
  assert.equal(resultado.actualizadoEn?.getTime(), despues.getTime())
  assert.equal(env.auditorias.length, 1)
  assert.ok(env.auditorias[0].includes('Creación'))
})

test('registros-cms: crear con permiso revocado no persiste', async () => {
  const env = entorno('registroCMS'); env.opciones.permiso = false
  await assert.rejects(new PrismaRegistrosCMS(env.db).crear(datosParaCrear(env), contexto), /Acceso denegado/)
  assert.equal(env.consultas.filter(x => x.metodo === 'create').length, 0)
})

test('registros-cms: auditoría fallida revierte la creación', async () => {
  const env = entorno('registroCMS'); env.opciones.fallarAuditoria = true
  const cantidad = env.tablas.registroCMS.length
  await assert.rejects(new PrismaRegistrosCMS(env.db).crear(datosParaCrear(env), contexto), /Fallo auditoría/)
  assert.equal(env.tablas.registroCMS.length, cantidad)
})

test('registros: baja lógica bloqueada por contenidos activos', async () => {
  const env = entorno('registroCMS'); env.tablas.contenidoRegistro[0].registroId = 2n
  const e = mapearRegistroCMS(env.fila() as Parameters<typeof mapearRegistroCMS>[0]); e.eliminar(despues)
  await assert.rejects(new PrismaRegistrosCMS(env.db).guardar(e, antes, contexto), /contenidos activos/)
})
