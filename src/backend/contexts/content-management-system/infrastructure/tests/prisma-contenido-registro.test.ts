import assert from 'node:assert/strict'
import { test } from 'node:test'
import { PrismaContenidosRegistro } from '../prisma-contenido-registro.js'
import { mapearContenidoRegistro } from '../mappers/contenido-registro.js'
import { entorno, contexto, antes, despues } from './soporte-pruebas-cms.js'

test('contenidos-registro: permiso revocado impide escribir y auditar', async () => {
  const env = entorno('contenidoRegistro'); env.opciones.permiso = false
  const e = mapearContenidoRegistro(env.fila() as Parameters<typeof mapearContenidoRegistro>[0]); e.reordenar(e.orden, despues)
  await assert.rejects(new PrismaContenidosRegistro(env.db).guardar(e, antes, contexto), /Acceso denegado/)
  assert.equal(env.consultas.filter(x => x.metodo === 'updateMany').length, 0)
  assert.equal(env.auditorias.length, 0)
})

test('contenidos-registro: versión obsoleta no cambia ni audita', async () => {
  const env = entorno('contenidoRegistro'); const e = mapearContenidoRegistro(env.fila() as Parameters<typeof mapearContenidoRegistro>[0]); e.reordenar(e.orden, despues)
  await assert.rejects(new PrismaContenidosRegistro(env.db).guardar(e, new Date(antes.getTime()-1), contexto), /modificad/)
  assert.equal(env.auditorias.length, 0)
  assert.equal(env.fila().actualizadoEn.getTime(), antes.getTime())
})

test('contenidos-registro: guardar usa Serializable, CAS, permiso y auditoría IAM', async () => {
  const env = entorno('contenidoRegistro'); const e = mapearContenidoRegistro(env.fila() as Parameters<typeof mapearContenidoRegistro>[0]); e.reordenar(e.orden, despues)
  await new PrismaContenidosRegistro(env.db).guardar(e, antes, contexto)
  assert.equal(env.fila().actualizadoEn.getTime(), despues.getTime())
  assert.equal(env.consultas[0].args.isolationLevel, 'Serializable')
  assert.ok(JSON.stringify(env.consultas.find(x => x.modelo === 'perfil')?.args).includes('cms.contenidos_registro.manage'))
  const actualizacion = env.consultas.find(x => x.modelo === 'contenidoRegistro' && x.metodo === 'updateMany')!
  assert.equal(actualizacion.args.where.actualizadoEn.getTime(), antes.getTime())
  assert.equal(env.auditorias.length, 1)
  assert.ok(env.auditorias[0].includes('127.0.0.1'))
  assert.ok(env.auditorias[0].includes('registro_contenido'))
})

test('contenidos-registro: un fallo de auditoría revierte el cambio', async () => {
  const env = entorno('contenidoRegistro'); env.opciones.fallarAuditoria = true
  const e = mapearContenidoRegistro(env.fila() as Parameters<typeof mapearContenidoRegistro>[0]); e.reordenar(e.orden, despues)
  await assert.rejects(new PrismaContenidosRegistro(env.db).guardar(e, antes, contexto), /Fallo auditoría/)
  assert.equal(env.fila().actualizadoEn.getTime(), antes.getTime())
  assert.equal(env.auditorias.length, 0)
})

test('contenidos-registro: el resultado CAS cero impide auditoría', async () => {
  const env = entorno('contenidoRegistro'); env.opciones.fallarCambio = true
  const e = mapearContenidoRegistro(env.fila() as Parameters<typeof mapearContenidoRegistro>[0]); e.reordenar(e.orden, despues)
  await assert.rejects(new PrismaContenidosRegistro(env.db).guardar(e, antes, contexto), /modificad/)
  assert.equal(env.auditorias.length, 0)
})

function datosParaCrear(env: ReturnType<typeof entorno>) {
  const e = mapearContenidoRegistro(env.fila() as Parameters<typeof mapearContenidoRegistro>[0])
  return { empresaId: e.empresaId, registroId: e.registroId, orden: e.orden, campos: e.campos }
}

test('contenidos-registro: crear genera ID, fecha y auditoría', async () => {
  const env = entorno('contenidoRegistro')
  const resultado = await new PrismaContenidosRegistro(env.db).crear(datosParaCrear(env), contexto)
  assert.equal(resultado.id, 99n)
  assert.equal(resultado.actualizadoEn?.getTime(), despues.getTime())
  assert.equal(env.auditorias.length, 1)
  assert.ok(env.auditorias[0].includes('Creación'))
})

test('contenidos-registro: crear con permiso revocado no persiste', async () => {
  const env = entorno('contenidoRegistro'); env.opciones.permiso = false
  await assert.rejects(new PrismaContenidosRegistro(env.db).crear(datosParaCrear(env), contexto), /Acceso denegado/)
  assert.equal(env.consultas.filter(x => x.metodo === 'create').length, 0)
})

test('contenidos-registro: auditoría fallida revierte la creación', async () => {
  const env = entorno('contenidoRegistro'); env.opciones.fallarAuditoria = true
  const cantidad = env.tablas.contenidoRegistro.length
  await assert.rejects(new PrismaContenidosRegistro(env.db).crear(datosParaCrear(env), contexto), /Fallo auditoría/)
  assert.equal(env.tablas.contenidoRegistro.length, cantidad)
})

test('contenido de registro: padre inexistente impide crear', async () => {
  const env = entorno('contenidoRegistro'); env.tablas.registroCMS.length = 0
  await assert.rejects(new PrismaContenidosRegistro(env.db).crear(datosParaCrear(env), contexto), /Registro CMS no disponible/)
})
