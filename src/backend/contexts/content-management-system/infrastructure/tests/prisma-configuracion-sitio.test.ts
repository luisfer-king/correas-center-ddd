import assert from 'node:assert/strict'
import { test } from 'node:test'
import { PrismaConfiguracionesSitio } from '../prisma-configuracion-sitio.js'
import { mapearConfiguracionSitio } from '../mappers/configuracion-sitio.js'
import { entorno, contexto, antes, despues } from './soporte-pruebas-cms.js'

test('configuracion-sitio: permiso revocado impide escribir y auditar', async () => {
  const env = entorno('configuracionSitio'); env.opciones.permiso = false
  const e = mapearConfiguracionSitio(env.fila() as Parameters<typeof mapearConfiguracionSitio>[0]); e.editar({ valor: 'nuevo', tipo: null, descripcion: null, grupo: null }, despues)
  await assert.rejects(new PrismaConfiguracionesSitio(env.db).guardar(e, antes, contexto), /Acceso denegado/)
  assert.equal(env.consultas.filter(x => x.metodo === 'updateMany').length, 0)
  assert.equal(env.auditorias.length, 0)
})

test('configuracion-sitio: versión obsoleta no cambia ni audita', async () => {
  const env = entorno('configuracionSitio'); const e = mapearConfiguracionSitio(env.fila() as Parameters<typeof mapearConfiguracionSitio>[0]); e.editar({ valor: 'nuevo', tipo: null, descripcion: null, grupo: null }, despues)
  await assert.rejects(new PrismaConfiguracionesSitio(env.db).guardar(e, new Date(antes.getTime()-1), contexto), /modificad/)
  assert.equal(env.auditorias.length, 0)
  assert.equal(env.fila().actualizadoEn.getTime(), antes.getTime())
})

test('configuracion-sitio: guardar usa Serializable, CAS, permiso y auditoría IAM', async () => {
  const env = entorno('configuracionSitio'); const e = mapearConfiguracionSitio(env.fila() as Parameters<typeof mapearConfiguracionSitio>[0]); e.editar({ valor: 'nuevo', tipo: null, descripcion: null, grupo: null }, despues)
  await new PrismaConfiguracionesSitio(env.db).guardar(e, antes, contexto)
  assert.equal(env.fila().actualizadoEn.getTime(), despues.getTime())
  assert.equal(env.consultas[0].args.isolationLevel, 'Serializable')
  assert.ok(JSON.stringify(env.consultas.find(x => x.modelo === 'perfil')?.args).includes('cms.configuracion_sitio.manage'))
  const actualizacion = env.consultas.find(x => x.modelo === 'configuracionSitio' && x.metodo === 'updateMany')!
  assert.equal(actualizacion.args.where.actualizadoEn.getTime(), antes.getTime())
  assert.equal(env.auditorias.length, 1)
  assert.ok(env.auditorias[0].includes('127.0.0.1'))
  assert.ok(env.auditorias[0].includes('configuracion_sitio'))
})

test('configuracion-sitio: un fallo de auditoría revierte el cambio', async () => {
  const env = entorno('configuracionSitio'); env.opciones.fallarAuditoria = true
  const e = mapearConfiguracionSitio(env.fila() as Parameters<typeof mapearConfiguracionSitio>[0]); e.editar({ valor: 'nuevo', tipo: null, descripcion: null, grupo: null }, despues)
  await assert.rejects(new PrismaConfiguracionesSitio(env.db).guardar(e, antes, contexto), /Fallo auditoría/)
  assert.equal(env.fila().actualizadoEn.getTime(), antes.getTime())
  assert.equal(env.auditorias.length, 0)
})

test('configuracion-sitio: el resultado CAS cero impide auditoría', async () => {
  const env = entorno('configuracionSitio'); env.opciones.fallarCambio = true
  const e = mapearConfiguracionSitio(env.fila() as Parameters<typeof mapearConfiguracionSitio>[0]); e.editar({ valor: 'nuevo', tipo: null, descripcion: null, grupo: null }, despues)
  await assert.rejects(new PrismaConfiguracionesSitio(env.db).guardar(e, antes, contexto), /modificad/)
  assert.equal(env.auditorias.length, 0)
})

function datosParaCrear(env: ReturnType<typeof entorno>) {
  const e = mapearConfiguracionSitio(env.fila() as Parameters<typeof mapearConfiguracionSitio>[0])
  return { empresaId: e.empresaId, clave: e.clave, valor: e.valor, tipo: e.tipo, descripcion: e.descripcion, grupo: e.grupo, activo: e.activo }
}

test('configuracion-sitio: crear genera ID, fecha y auditoría', async () => {
  const env = entorno('configuracionSitio')
  const resultado = await new PrismaConfiguracionesSitio(env.db).crear(datosParaCrear(env), contexto)
  assert.equal(resultado.id, 99)
  assert.equal(resultado.actualizadoEn?.getTime(), despues.getTime())
  assert.equal(env.auditorias.length, 1)
  assert.ok(env.auditorias[0].includes('Creación'))
})

test('configuracion-sitio: crear con permiso revocado no persiste', async () => {
  const env = entorno('configuracionSitio'); env.opciones.permiso = false
  await assert.rejects(new PrismaConfiguracionesSitio(env.db).crear(datosParaCrear(env), contexto), /Acceso denegado/)
  assert.equal(env.consultas.filter(x => x.metodo === 'create').length, 0)
})

test('configuracion-sitio: auditoría fallida revierte la creación', async () => {
  const env = entorno('configuracionSitio'); env.opciones.fallarAuditoria = true
  const cantidad = env.tablas.configuracionSitio.length
  await assert.rejects(new PrismaConfiguracionesSitio(env.db).crear(datosParaCrear(env), contexto), /Fallo auditoría/)
  assert.equal(env.tablas.configuracionSitio.length, cantidad)
})

test('configuración: versión anterior nullable y clave duplicada se conservan', async () => {
  const env = entorno('configuracionSitio'); env.tablas.configuracionSitio[0].actualizadoEn = null
  const e = mapearConfiguracionSitio(env.fila() as Parameters<typeof mapearConfiguracionSitio>[0])
  e.editar({ valor: 'nuevo', tipo: null, descripcion: null, grupo: null }, despues)
  await new PrismaConfiguracionesSitio(env.db).guardar(e, null, contexto)
  await new PrismaConfiguracionesSitio(env.db).crear(datosParaCrear(env), contexto)
  assert.equal(env.tablas.configuracionSitio.length, 2)
  assert.equal((await new PrismaConfiguracionesSitio(env.db).listar({ empresaId: null })).length, 2)
})
