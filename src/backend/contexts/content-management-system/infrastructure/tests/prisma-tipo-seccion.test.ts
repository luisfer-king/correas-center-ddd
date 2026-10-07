import assert from 'node:assert/strict'
import { test } from 'node:test'
import { PrismaTiposSeccion } from '../prisma-tipo-seccion.js'
import { mapearTipoSeccion } from '../mappers/tipo-seccion.js'
import { entorno, contexto, antes, despues } from './soporte-pruebas-cms.js'

test('tipos-seccion: permiso revocado impide escribir y auditar', async () => {
  const env = entorno('tipoSeccion'); env.opciones.permiso = false
  const e = mapearTipoSeccion(env.fila() as Parameters<typeof mapearTipoSeccion>[0]); e.editar('Nuevo', null, null, despues)
  await assert.rejects(new PrismaTiposSeccion(env.db).guardar(e, antes, contexto), /Acceso denegado/)
  assert.equal(env.consultas.filter(x => x.metodo === 'updateMany').length, 0)
  assert.equal(env.auditorias.length, 0)
})

test('tipos-seccion: versión obsoleta no cambia ni audita', async () => {
  const env = entorno('tipoSeccion'); const e = mapearTipoSeccion(env.fila() as Parameters<typeof mapearTipoSeccion>[0]); e.editar('Nuevo', null, null, despues)
  await assert.rejects(new PrismaTiposSeccion(env.db).guardar(e, new Date(antes.getTime()-1), contexto), /modificad/)
  assert.equal(env.auditorias.length, 0)
  assert.equal(env.fila().actualizadoEn.getTime(), antes.getTime())
})

test('tipos-seccion: guardar usa Serializable, CAS, permiso y auditoría IAM', async () => {
  const env = entorno('tipoSeccion'); const e = mapearTipoSeccion(env.fila() as Parameters<typeof mapearTipoSeccion>[0]); e.editar('Nuevo', null, null, despues)
  await new PrismaTiposSeccion(env.db).guardar(e, antes, contexto)
  assert.equal(env.fila().actualizadoEn.getTime(), despues.getTime())
  assert.equal(env.consultas[0].args.isolationLevel, 'Serializable')
  assert.ok(JSON.stringify(env.consultas.find(x => x.modelo === 'perfil')?.args).includes('cms.tipos_seccion.manage'))
  const actualizacion = env.consultas.find(x => x.modelo === 'tipoSeccion' && x.metodo === 'updateMany')!
  assert.equal(actualizacion.args.where.actualizadoEn.getTime(), antes.getTime())
  assert.equal(env.auditorias.length, 1)
  assert.ok(env.auditorias[0].includes('127.0.0.1'))
  assert.ok(env.auditorias[0].includes('tipo_seccion'))
})

test('tipos-seccion: un fallo de auditoría revierte el cambio', async () => {
  const env = entorno('tipoSeccion'); env.opciones.fallarAuditoria = true
  const e = mapearTipoSeccion(env.fila() as Parameters<typeof mapearTipoSeccion>[0]); e.editar('Nuevo', null, null, despues)
  await assert.rejects(new PrismaTiposSeccion(env.db).guardar(e, antes, contexto), /Fallo auditoría/)
  assert.equal(env.fila().actualizadoEn.getTime(), antes.getTime())
  assert.equal(env.auditorias.length, 0)
})

test('tipos-seccion: el resultado CAS cero impide auditoría', async () => {
  const env = entorno('tipoSeccion'); env.opciones.fallarCambio = true
  const e = mapearTipoSeccion(env.fila() as Parameters<typeof mapearTipoSeccion>[0]); e.editar('Nuevo', null, null, despues)
  await assert.rejects(new PrismaTiposSeccion(env.db).guardar(e, antes, contexto), /modificad/)
  assert.equal(env.auditorias.length, 0)
})

function datosParaCrear(env: ReturnType<typeof entorno>) {
  const e = mapearTipoSeccion(env.fila() as Parameters<typeof mapearTipoSeccion>[0])
  return { nombre: e.nombre, slug: e.slug, descripcion: e.descripcion, camposMetadata: e.clavesMetadata, icono: e.icono, orden: e.orden }
}

test('tipos-seccion: crear genera ID, fecha y auditoría', async () => {
  const env = entorno('tipoSeccion')
  const resultado = await new PrismaTiposSeccion(env.db).crear(datosParaCrear(env), contexto)
  assert.equal(resultado.id, 99n)
  assert.equal(resultado.actualizadoEn?.getTime(), despues.getTime())
  assert.equal(env.auditorias.length, 1)
  assert.ok(env.auditorias[0].includes('Creación'))
})

test('tipos-seccion: crear con permiso revocado no persiste', async () => {
  const env = entorno('tipoSeccion'); env.opciones.permiso = false
  await assert.rejects(new PrismaTiposSeccion(env.db).crear(datosParaCrear(env), contexto), /Acceso denegado/)
  assert.equal(env.consultas.filter(x => x.metodo === 'create').length, 0)
})

test('tipos-seccion: auditoría fallida revierte la creación', async () => {
  const env = entorno('tipoSeccion'); env.opciones.fallarAuditoria = true
  const cantidad = env.tablas.tipoSeccion.length
  await assert.rejects(new PrismaTiposSeccion(env.db).crear(datosParaCrear(env), contexto), /Fallo auditoría/)
  assert.equal(env.tablas.tipoSeccion.length, cantidad)
})

test('tipos-seccion: retirar claves usadas se rechaza sin escritura', async () => {
  const env = entorno('tipoSeccion'); env.tablas.contenidoSeccion[0].tipoSeccionId = 2n
  const e = mapearTipoSeccion(env.fila() as Parameters<typeof mapearTipoSeccion>[0]); e.cambiarClaves([], despues)
  await assert.rejects(new PrismaTiposSeccion(env.db).guardar(e, antes, contexto), /claves no declaradas/)
  assert.equal(env.auditorias.length, 0)
})
test('tipos-seccion: inactivar con contenidos activos se rechaza', async () => {
  const env = entorno('tipoSeccion'); env.tablas.contenidoSeccion[0].tipoSeccionId = 2n
  const e = mapearTipoSeccion(env.fila() as Parameters<typeof mapearTipoSeccion>[0]); e.inactivar(despues)
  await assert.rejects(new PrismaTiposSeccion(env.db).guardar(e, antes, contexto), /contenidos activos/)
})
