import assert from 'node:assert/strict'
import { test } from 'node:test'
import { PrismaElementosFooter } from '../prisma-footer-elemento.js'
import { mapearFooterElemento } from '../mappers/footer-elemento.js'
import { entorno, contexto, antes, despues } from './soporte-pruebas-cms.js'

test('elementos-footer: permiso revocado impide escribir y auditar', async () => {
  const env = entorno('footerElemento'); env.opciones.permiso = false
  const e = mapearFooterElemento(env.fila() as Parameters<typeof mapearFooterElemento>[0]); e.reordenar(e.orden, despues)
  await assert.rejects(new PrismaElementosFooter(env.db).guardar(e, antes, contexto), /Acceso denegado/)
  assert.equal(env.consultas.filter(x => x.metodo === 'updateMany').length, 0)
  assert.equal(env.auditorias.length, 0)
})

test('elementos-footer: versión obsoleta no cambia ni audita', async () => {
  const env = entorno('footerElemento'); const e = mapearFooterElemento(env.fila() as Parameters<typeof mapearFooterElemento>[0]); e.reordenar(e.orden, despues)
  await assert.rejects(new PrismaElementosFooter(env.db).guardar(e, new Date(antes.getTime()-1), contexto), /modificad/)
  assert.equal(env.auditorias.length, 0)
  assert.equal(env.fila().actualizadoEn.getTime(), antes.getTime())
})

test('elementos-footer: guardar usa Serializable, CAS, permiso y auditoría IAM', async () => {
  const env = entorno('footerElemento'); const e = mapearFooterElemento(env.fila() as Parameters<typeof mapearFooterElemento>[0]); e.reordenar(e.orden, despues)
  await new PrismaElementosFooter(env.db).guardar(e, antes, contexto)
  assert.equal(env.fila().actualizadoEn.getTime(), despues.getTime())
  assert.equal(env.consultas[0].args.isolationLevel, 'Serializable')
  assert.ok(JSON.stringify(env.consultas.find(x => x.modelo === 'perfil')?.args).includes('cms.elementos_footer.manage'))
  const actualizacion = env.consultas.find(x => x.modelo === 'footerElemento' && x.metodo === 'updateMany')!
  assert.equal(actualizacion.args.where.actualizadoEn.getTime(), antes.getTime())
  assert.equal(env.auditorias.length, 1)
  assert.ok(env.auditorias[0].includes('127.0.0.1'))
  assert.ok(env.auditorias[0].includes('footers'))
})

test('elementos-footer: un fallo de auditoría revierte el cambio', async () => {
  const env = entorno('footerElemento'); env.opciones.fallarAuditoria = true
  const e = mapearFooterElemento(env.fila() as Parameters<typeof mapearFooterElemento>[0]); e.reordenar(e.orden, despues)
  await assert.rejects(new PrismaElementosFooter(env.db).guardar(e, antes, contexto), /Fallo auditoría/)
  assert.equal(env.fila().actualizadoEn.getTime(), antes.getTime())
  assert.equal(env.auditorias.length, 0)
})

test('elementos-footer: el resultado CAS cero impide auditoría', async () => {
  const env = entorno('footerElemento'); env.opciones.fallarCambio = true
  const e = mapearFooterElemento(env.fila() as Parameters<typeof mapearFooterElemento>[0]); e.reordenar(e.orden, despues)
  await assert.rejects(new PrismaElementosFooter(env.db).guardar(e, antes, contexto), /modificad/)
  assert.equal(env.auditorias.length, 0)
})

function datosParaCrear(env: ReturnType<typeof entorno>) {
  const e = mapearFooterElemento(env.fila() as Parameters<typeof mapearFooterElemento>[0])
  return { empresaId: e.empresaId, tipo: e.tipo, titulo: e.titulo, icono: e.icono, orden: e.orden, mostrar: e.mostrar, destino: e.destino, enlace: e.enlace }
}

test('elementos-footer: crear genera ID, fecha y auditoría', async () => {
  const env = entorno('footerElemento')
  const resultado = await new PrismaElementosFooter(env.db).crear(datosParaCrear(env), contexto)
  assert.equal(resultado.id, 99n)
  assert.equal(resultado.actualizadoEn?.getTime(), despues.getTime())
  assert.equal(env.auditorias.length, 1)
  assert.ok(env.auditorias[0].includes('Creación'))
})

test('elementos-footer: crear con permiso revocado no persiste', async () => {
  const env = entorno('footerElemento'); env.opciones.permiso = false
  await assert.rejects(new PrismaElementosFooter(env.db).crear(datosParaCrear(env), contexto), /Acceso denegado/)
  assert.equal(env.consultas.filter(x => x.metodo === 'create').length, 0)
})

test('elementos-footer: auditoría fallida revierte la creación', async () => {
  const env = entorno('footerElemento'); env.opciones.fallarAuditoria = true
  const cantidad = env.tablas.footerElemento.length
  await assert.rejects(new PrismaElementosFooter(env.db).crear(datosParaCrear(env), contexto), /Fallo auditoría/)
  assert.equal(env.tablas.footerElemento.length, cantidad)
})

test('footer: empresa ausente impide crear', async () => {
  const env = entorno('footerElemento'); env.tablas.empresa.length = 0
  await assert.rejects(new PrismaElementosFooter(env.db).crear(datosParaCrear(env), contexto), /Empresa no disponible/)
})
