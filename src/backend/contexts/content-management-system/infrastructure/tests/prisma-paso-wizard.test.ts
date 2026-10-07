import assert from 'node:assert/strict'
import { test } from 'node:test'
import { PrismaPasosWizard } from '../prisma-paso-wizard.js'
import { mapearPasoWizard } from '../mappers/paso-wizard.js'
import { entorno, contexto, antes, despues } from './soporte-pruebas-cms.js'

test('pasos-wizard: permiso revocado impide escribir y auditar', async () => {
  const env = entorno('pasoWizard'); env.opciones.permiso = false
  const e = mapearPasoWizard(env.fila() as Parameters<typeof mapearPasoWizard>[0]); e.reordenar(e.orden, despues)
  await assert.rejects(new PrismaPasosWizard(env.db).guardar(e, antes, contexto), /Acceso denegado/)
  assert.equal(env.consultas.filter(x => x.metodo === 'updateMany').length, 0)
  assert.equal(env.auditorias.length, 0)
})

test('pasos-wizard: versión obsoleta no cambia ni audita', async () => {
  const env = entorno('pasoWizard'); const e = mapearPasoWizard(env.fila() as Parameters<typeof mapearPasoWizard>[0]); e.reordenar(e.orden, despues)
  await assert.rejects(new PrismaPasosWizard(env.db).guardar(e, new Date(antes.getTime()-1), contexto), /modificad/)
  assert.equal(env.auditorias.length, 0)
  assert.equal(env.fila().actualizadoEn.getTime(), antes.getTime())
})

test('pasos-wizard: guardar usa Serializable, CAS, permiso y auditoría IAM', async () => {
  const env = entorno('pasoWizard'); const e = mapearPasoWizard(env.fila() as Parameters<typeof mapearPasoWizard>[0]); e.reordenar(e.orden, despues)
  await new PrismaPasosWizard(env.db).guardar(e, antes, contexto)
  assert.equal(env.fila().actualizadoEn.getTime(), despues.getTime())
  assert.equal(env.consultas[0].args.isolationLevel, 'Serializable')
  assert.ok(JSON.stringify(env.consultas.find(x => x.modelo === 'perfil')?.args).includes('cms.pasos_wizard.manage'))
  const actualizacion = env.consultas.find(x => x.modelo === 'pasoWizard' && x.metodo === 'updateMany')!
  assert.equal(actualizacion.args.where.actualizadoEn.getTime(), antes.getTime())
  assert.equal(env.auditorias.length, 1)
  assert.ok(env.auditorias[0].includes('127.0.0.1'))
  assert.ok(env.auditorias[0].includes('pasos_wizard'))
})

test('pasos-wizard: un fallo de auditoría revierte el cambio', async () => {
  const env = entorno('pasoWizard'); env.opciones.fallarAuditoria = true
  const e = mapearPasoWizard(env.fila() as Parameters<typeof mapearPasoWizard>[0]); e.reordenar(e.orden, despues)
  await assert.rejects(new PrismaPasosWizard(env.db).guardar(e, antes, contexto), /Fallo auditoría/)
  assert.equal(env.fila().actualizadoEn.getTime(), antes.getTime())
  assert.equal(env.auditorias.length, 0)
})

test('pasos-wizard: el resultado CAS cero impide auditoría', async () => {
  const env = entorno('pasoWizard'); env.opciones.fallarCambio = true
  const e = mapearPasoWizard(env.fila() as Parameters<typeof mapearPasoWizard>[0]); e.reordenar(e.orden, despues)
  await assert.rejects(new PrismaPasosWizard(env.db).guardar(e, antes, contexto), /modificad/)
  assert.equal(env.auditorias.length, 0)
})

function datosParaCrear(env: ReturnType<typeof entorno>) {
  const e = mapearPasoWizard(env.fila() as Parameters<typeof mapearPasoWizard>[0])
  return { empresaId: e.empresaId, identificador: e.identificador, titulo: e.titulo, descripcion: e.descripcion, fuenteDatos: e.fuenteDatos, campoFiltro: e.campoFiltro, orden: e.orden }
}

test('pasos-wizard: crear genera ID, fecha y auditoría', async () => {
  const env = entorno('pasoWizard')
  const resultado = await new PrismaPasosWizard(env.db).crear(datosParaCrear(env), contexto)
  assert.equal(resultado.id, 99n)
  assert.equal(resultado.actualizadoEn?.getTime(), despues.getTime())
  assert.equal(env.auditorias.length, 1)
  assert.ok(env.auditorias[0].includes('Creación'))
})

test('pasos-wizard: crear con permiso revocado no persiste', async () => {
  const env = entorno('pasoWizard'); env.opciones.permiso = false
  await assert.rejects(new PrismaPasosWizard(env.db).crear(datosParaCrear(env), contexto), /Acceso denegado/)
  assert.equal(env.consultas.filter(x => x.metodo === 'create').length, 0)
})

test('pasos-wizard: auditoría fallida revierte la creación', async () => {
  const env = entorno('pasoWizard'); env.opciones.fallarAuditoria = true
  const cantidad = env.tablas.pasoWizard.length
  await assert.rejects(new PrismaPasosWizard(env.db).crear(datosParaCrear(env), contexto), /Fallo auditoría/)
  assert.equal(env.tablas.pasoWizard.length, cantidad)
})

test('wizard: paginación inválida se rechaza antes de consultar', async () => {
  const env = entorno('pasoWizard')
  await assert.rejects(new PrismaPasosWizard(env.db).listar({ limite: 0 }), /Paginación inválida/)
  assert.equal(env.consultas.length, 0)
})
