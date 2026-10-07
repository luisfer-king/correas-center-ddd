import assert from 'node:assert/strict'
import { test } from 'node:test'
import { PrismaContenidosSeccion } from '../prisma-contenido-seccion.js'
import { mapearContenidoSeccion } from '../mappers/contenido-seccion.js'
import { entorno, contexto, antes, despues } from './soporte-pruebas-cms.js'

test('contenidos-seccion: permiso revocado impide escribir y auditar', async () => {
  const env = entorno('contenidoSeccion'); env.opciones.permiso = false
  const e = mapearContenidoSeccion(env.fila() as Parameters<typeof mapearContenidoSeccion>[0]); e.reordenar(e.orden, despues)
  await assert.rejects(new PrismaContenidosSeccion(env.db).guardar(e, antes, contexto), /Acceso denegado/)
  assert.equal(env.consultas.filter(x => x.metodo === 'updateMany').length, 0)
  assert.equal(env.auditorias.length, 0)
})

test('contenidos-seccion: versión obsoleta no cambia ni audita', async () => {
  const env = entorno('contenidoSeccion'); const e = mapearContenidoSeccion(env.fila() as Parameters<typeof mapearContenidoSeccion>[0]); e.reordenar(e.orden, despues)
  await assert.rejects(new PrismaContenidosSeccion(env.db).guardar(e, new Date(antes.getTime()-1), contexto), /modificad/)
  assert.equal(env.auditorias.length, 0)
  assert.equal(env.fila().actualizadoEn.getTime(), antes.getTime())
})

test('contenidos-seccion: guardar usa Serializable, CAS, permiso y auditoría IAM', async () => {
  const env = entorno('contenidoSeccion'); const e = mapearContenidoSeccion(env.fila() as Parameters<typeof mapearContenidoSeccion>[0]); e.reordenar(e.orden, despues)
  await new PrismaContenidosSeccion(env.db).guardar(e, antes, contexto)
  assert.equal(env.fila().actualizadoEn.getTime(), despues.getTime())
  assert.equal(env.consultas[0].args.isolationLevel, 'Serializable')
  assert.ok(JSON.stringify(env.consultas.find(x => x.modelo === 'perfil')?.args).includes('cms.contenidos_seccion.manage'))
  const actualizacion = env.consultas.find(x => x.modelo === 'contenidoSeccion' && x.metodo === 'updateMany')!
  assert.equal(actualizacion.args.where.actualizadoEn.getTime(), antes.getTime())
  assert.equal(env.auditorias.length, 1)
  assert.ok(env.auditorias[0].includes('127.0.0.1'))
  assert.ok(env.auditorias[0].includes('contenido_seccion'))
})

test('contenidos-seccion: un fallo de auditoría revierte el cambio', async () => {
  const env = entorno('contenidoSeccion'); env.opciones.fallarAuditoria = true
  const e = mapearContenidoSeccion(env.fila() as Parameters<typeof mapearContenidoSeccion>[0]); e.reordenar(e.orden, despues)
  await assert.rejects(new PrismaContenidosSeccion(env.db).guardar(e, antes, contexto), /Fallo auditoría/)
  assert.equal(env.fila().actualizadoEn.getTime(), antes.getTime())
  assert.equal(env.auditorias.length, 0)
})

test('contenidos-seccion: el resultado CAS cero impide auditoría', async () => {
  const env = entorno('contenidoSeccion'); env.opciones.fallarCambio = true
  const e = mapearContenidoSeccion(env.fila() as Parameters<typeof mapearContenidoSeccion>[0]); e.reordenar(e.orden, despues)
  await assert.rejects(new PrismaContenidosSeccion(env.db).guardar(e, antes, contexto), /modificad/)
  assert.equal(env.auditorias.length, 0)
})

function datosParaCrear(env: ReturnType<typeof entorno>) {
  const e = mapearContenidoSeccion(env.fila() as Parameters<typeof mapearContenidoSeccion>[0])
  return { empresaId: e.empresaId, tipoSeccionId: e.tipoSeccionId, metadata: e.metadata, orden: e.orden, mostrar: e.mostrar, campos: e.campos }
}

test('contenidos-seccion: crear genera ID, fecha y auditoría', async () => {
  const env = entorno('contenidoSeccion')
  const resultado = await new PrismaContenidosSeccion(env.db).crear(datosParaCrear(env), contexto)
  assert.equal(resultado.id, 99n)
  assert.equal(resultado.actualizadoEn?.getTime(), despues.getTime())
  assert.equal(env.auditorias.length, 1)
  assert.ok(env.auditorias[0].includes('Creación'))
})

test('contenidos-seccion: crear con permiso revocado no persiste', async () => {
  const env = entorno('contenidoSeccion'); env.opciones.permiso = false
  await assert.rejects(new PrismaContenidosSeccion(env.db).crear(datosParaCrear(env), contexto), /Acceso denegado/)
  assert.equal(env.consultas.filter(x => x.metodo === 'create').length, 0)
})

test('contenidos-seccion: auditoría fallida revierte la creación', async () => {
  const env = entorno('contenidoSeccion'); env.opciones.fallarAuditoria = true
  const cantidad = env.tablas.contenidoSeccion.length
  await assert.rejects(new PrismaContenidosSeccion(env.db).crear(datosParaCrear(env), contexto), /Fallo auditoría/)
  assert.equal(env.tablas.contenidoSeccion.length, cantidad)
})

test('secciones: metadata no declarada impide creación', async () => {
  const env = entorno('contenidoSeccion')
  await assert.rejects(new PrismaContenidosSeccion(env.db).crear({ ...datosParaCrear(env), metadata: { desconocida: true } }, contexto), /claves no declaradas/)
  assert.equal(env.auditorias.length, 0)
})
test('secciones: padre eliminado impide creación', async () => {
  const env = entorno('contenidoSeccion'); env.tablas.tipoSeccion.find(x => x.id === 1n)!.eliminadoEn = antes
  await assert.rejects(new PrismaContenidosSeccion(env.db).crear(datosParaCrear(env), contexto), /Tipo de sección no disponible/)
})
