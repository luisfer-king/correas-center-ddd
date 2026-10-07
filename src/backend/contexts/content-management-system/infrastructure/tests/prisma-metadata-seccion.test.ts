import assert from 'node:assert/strict'
import { test } from 'node:test'
import { PrismaMetadataSeccion } from '../prisma-metadata-seccion.js'
import { entorno, contexto, antes, despues } from './soporte-pruebas-cms.js'

test('metadata: leer utiliza identidad y versión de la sección', async () => {
  const env = entorno('contenidoSeccion'); const resultado = await new PrismaMetadataSeccion(env.db).obtener(2n)
  assert.equal(resultado?.contenidoSeccionId, 2n)
  assert.equal(resultado?.actualizadoEn.getTime(), antes.getTime())
  assert.equal(await new PrismaMetadataSeccion(env.db).obtener(999n), null)
})
test('metadata: reemplazo avanza versión sin alterar campos ni crear filas', async () => {
  const env = entorno('contenidoSeccion'); const repo = new PrismaMetadataSeccion(env.db)
  const entidad = await repo.reemplazar(2n, { cta: { texto: 'Consultar' } }, antes, contexto)
  assert.deepEqual(entidad.metadata, { cta: { texto: 'Consultar' } })
  assert.equal(entidad.actualizadoEn.getTime(), despues.getTime())
  assert.equal(env.tablas.contenidoSeccion.length, 1)
  assert.equal(env.fila().titulo, null)
  const cambio = env.consultas.find(x => x.metodo === 'updateMany')!
  assert.deepEqual(Object.keys(cambio.args.data).sort(), ['actualizadoEn', 'metadata'])
  assert.ok(JSON.stringify(env.consultas.find(x => x.modelo === 'perfil')?.args).includes('cms.metadata_seccion.manage'))
})
test('metadata: conflicto de versión impide actualización', async () => {
  const env = entorno('contenidoSeccion')
  await assert.rejects(new PrismaMetadataSeccion(env.db).reemplazar(2n, {}, new Date(antes.getTime()-1), contexto), /modificada/)
  assert.equal(env.auditorias.length, 0)
})
test('metadata: claves fuera del tipo se rechazan antes de escribir', async () => {
  const env = entorno('contenidoSeccion')
  await assert.rejects(new PrismaMetadataSeccion(env.db).reemplazar(2n, { noDeclarada: true }, antes, contexto), /claves no declaradas/)
  assert.equal(env.consultas.filter(x => x.metodo === 'updateMany').length, 0)
})
test('metadata: permiso revocado impide actualización', async () => {
  const env = entorno('contenidoSeccion'); env.opciones.permiso = false
  await assert.rejects(new PrismaMetadataSeccion(env.db).reemplazar(2n, {}, antes, contexto), /Acceso denegado/)
})
test('metadata: fallo de auditoría revierte JSON y versión', async () => {
  const env = entorno('contenidoSeccion'); env.opciones.fallarAuditoria = true
  await assert.rejects(new PrismaMetadataSeccion(env.db).reemplazar(2n, {}, antes, contexto), /Fallo auditoría/)
  assert.deepEqual(env.fila().metadata, { cta: 'Cotizar' })
  assert.equal(env.fila().actualizadoEn.getTime(), antes.getTime())
})
test('metadata: sección eliminada no admite reemplazo', async () => {
  const env = entorno('contenidoSeccion'); env.tablas.contenidoSeccion[0].eliminadoEn = antes
  await assert.rejects(new PrismaMetadataSeccion(env.db).reemplazar(2n, {}, antes, contexto), /Sección no disponible/)
})
