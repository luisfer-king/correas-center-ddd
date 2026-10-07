import assert from 'node:assert/strict'
import { test } from 'node:test'
import { PrismaItemsMenu } from '../prisma-menu-item.js'
import { mapearMenuItem } from '../mappers/menu-item.js'
import { entorno, contexto, antes, despues } from './soporte-pruebas-cms.js'

test('items-menu: permiso revocado impide escribir y auditar', async () => {
  const env = entorno('menuItem'); env.opciones.permiso = false
  const e = mapearMenuItem(env.fila() as Parameters<typeof mapearMenuItem>[0]); e.reordenar(e.orden, despues)
  await assert.rejects(new PrismaItemsMenu(env.db).guardar(e, antes, contexto), /Acceso denegado/)
  assert.equal(env.consultas.filter(x => x.metodo === 'updateMany').length, 0)
  assert.equal(env.auditorias.length, 0)
})

test('items-menu: versión obsoleta no cambia ni audita', async () => {
  const env = entorno('menuItem'); const e = mapearMenuItem(env.fila() as Parameters<typeof mapearMenuItem>[0]); e.reordenar(e.orden, despues)
  await assert.rejects(new PrismaItemsMenu(env.db).guardar(e, new Date(antes.getTime()-1), contexto), /modificad/)
  assert.equal(env.auditorias.length, 0)
  assert.equal(env.fila().actualizadoEn.getTime(), antes.getTime())
})

test('items-menu: guardar usa Serializable, CAS, permiso y auditoría IAM', async () => {
  const env = entorno('menuItem'); const e = mapearMenuItem(env.fila() as Parameters<typeof mapearMenuItem>[0]); e.reordenar(e.orden, despues)
  await new PrismaItemsMenu(env.db).guardar(e, antes, contexto)
  assert.equal(env.fila().actualizadoEn.getTime(), despues.getTime())
  assert.equal(env.consultas[0].args.isolationLevel, 'Serializable')
  assert.ok(JSON.stringify(env.consultas.find(x => x.modelo === 'perfil')?.args).includes('cms.items_menu.manage'))
  const actualizacion = env.consultas.find(x => x.modelo === 'menuItem' && x.metodo === 'updateMany')!
  assert.equal(actualizacion.args.where.actualizadoEn.getTime(), antes.getTime())
  assert.equal(env.auditorias.length, 1)
  assert.ok(env.auditorias[0].includes('127.0.0.1'))
  assert.ok(env.auditorias[0].includes('menu_item'))
})

test('items-menu: un fallo de auditoría revierte el cambio', async () => {
  const env = entorno('menuItem'); env.opciones.fallarAuditoria = true
  const e = mapearMenuItem(env.fila() as Parameters<typeof mapearMenuItem>[0]); e.reordenar(e.orden, despues)
  await assert.rejects(new PrismaItemsMenu(env.db).guardar(e, antes, contexto), /Fallo auditoría/)
  assert.equal(env.fila().actualizadoEn.getTime(), antes.getTime())
  assert.equal(env.auditorias.length, 0)
})

test('items-menu: el resultado CAS cero impide auditoría', async () => {
  const env = entorno('menuItem'); env.opciones.fallarCambio = true
  const e = mapearMenuItem(env.fila() as Parameters<typeof mapearMenuItem>[0]); e.reordenar(e.orden, despues)
  await assert.rejects(new PrismaItemsMenu(env.db).guardar(e, antes, contexto), /modificad/)
  assert.equal(env.auditorias.length, 0)
})

function datosParaCrear(env: ReturnType<typeof entorno>) {
  const e = mapearMenuItem(env.fila() as Parameters<typeof mapearMenuItem>[0])
  return { menuId: e.menuId, ruta: e.ruta, orden: e.orden }
}

test('items-menu: crear genera ID, fecha y auditoría', async () => {
  const env = entorno('menuItem')
  const resultado = await new PrismaItemsMenu(env.db).crear(datosParaCrear(env), contexto)
  assert.equal(resultado.id, 99n)
  assert.equal(resultado.actualizadoEn?.getTime(), despues.getTime())
  assert.equal(env.auditorias.length, 1)
  assert.ok(env.auditorias[0].includes('Creación'))
})

test('items-menu: crear con permiso revocado no persiste', async () => {
  const env = entorno('menuItem'); env.opciones.permiso = false
  await assert.rejects(new PrismaItemsMenu(env.db).crear(datosParaCrear(env), contexto), /Acceso denegado/)
  assert.equal(env.consultas.filter(x => x.metodo === 'create').length, 0)
})

test('items-menu: auditoría fallida revierte la creación', async () => {
  const env = entorno('menuItem'); env.opciones.fallarAuditoria = true
  const cantidad = env.tablas.menuItem.length
  await assert.rejects(new PrismaItemsMenu(env.db).crear(datosParaCrear(env), contexto), /Fallo auditoría/)
  assert.equal(env.tablas.menuItem.length, cantidad)
})

test('ítems: cambio avanza la versión del menú y conserva otros ítems', async () => {
  const env = entorno('menuItem'); const e = mapearMenuItem(env.fila() as Parameters<typeof mapearMenuItem>[0]); e.reordenar(e.orden, despues)
  await new PrismaItemsMenu(env.db).guardar(e, antes, contexto)
  assert.equal(env.tablas.menu.find(x => x.id === 1n)?.actualizadoEn.getTime(), despues.getTime())
  assert.equal(env.tablas.menuItem.length, 1)
})
test('ítems: menú inactivo bloquea creación activa', async () => {
  const env = entorno('menuItem'); env.tablas.menu.find(x => x.id === 1n)!.estado = 'inactivo'
  await assert.rejects(new PrismaItemsMenu(env.db).crear(datosParaCrear(env), contexto), /Menú no disponible/)
})
