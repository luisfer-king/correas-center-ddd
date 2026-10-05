import assert from 'node:assert/strict'
import { test } from 'node:test'
import { PrismaMenus } from '../prisma-menu.js'
import { mapearMenu } from '../mappers/menu.js'
import { entorno, contexto, antes, despues } from './soporte-pruebas-cms.js'

test('menus: permiso revocado impide escribir y auditar', async () => {
  const env = entorno('menu'); env.opciones.permiso = false
  const e = mapearMenu({ ...env.fila(), relMenuItem: [] } as unknown as Parameters<typeof mapearMenu>[0]); e.reordenar(e.orden, despues)
  await assert.rejects(new PrismaMenus(env.db).guardar(e, antes, contexto), /Acceso denegado/)
  assert.equal(env.consultas.filter(x => x.metodo === 'updateMany').length, 0)
  assert.equal(env.auditorias.length, 0)
})

test('menus: versión obsoleta no cambia ni audita', async () => {
  const env = entorno('menu'); const e = mapearMenu({ ...env.fila(), relMenuItem: [] } as unknown as Parameters<typeof mapearMenu>[0]); e.reordenar(e.orden, despues)
  await assert.rejects(new PrismaMenus(env.db).guardar(e, new Date(antes.getTime()-1), contexto), /modificad/)
  assert.equal(env.auditorias.length, 0)
  assert.equal(env.fila().actualizadoEn.getTime(), antes.getTime())
})

test('menus: guardar usa Serializable, CAS, permiso y auditoría IAM', async () => {
  const env = entorno('menu'); const e = mapearMenu({ ...env.fila(), relMenuItem: [] } as unknown as Parameters<typeof mapearMenu>[0]); e.reordenar(e.orden, despues)
  await new PrismaMenus(env.db).guardar(e, antes, contexto)
  assert.equal(env.fila().actualizadoEn.getTime(), despues.getTime())
  assert.equal(env.consultas[0].args.isolationLevel, 'Serializable')
  assert.ok(JSON.stringify(env.consultas.find(x => x.modelo === 'perfil')?.args).includes('cms.menus.manage'))
  const actualizacion = env.consultas.find(x => x.modelo === 'menu' && x.metodo === 'updateMany')!
  assert.equal(actualizacion.args.where.actualizadoEn.getTime(), antes.getTime())
  assert.equal(env.auditorias.length, 1)
  assert.ok(env.auditorias[0].includes('127.0.0.1'))
  assert.ok(env.auditorias[0].includes('menus'))
})

test('menus: un fallo de auditoría revierte el cambio', async () => {
  const env = entorno('menu'); env.opciones.fallarAuditoria = true
  const e = mapearMenu({ ...env.fila(), relMenuItem: [] } as unknown as Parameters<typeof mapearMenu>[0]); e.reordenar(e.orden, despues)
  await assert.rejects(new PrismaMenus(env.db).guardar(e, antes, contexto), /Fallo auditoría/)
  assert.equal(env.fila().actualizadoEn.getTime(), antes.getTime())
  assert.equal(env.auditorias.length, 0)
})

test('menus: el resultado CAS cero impide auditoría', async () => {
  const env = entorno('menu'); env.opciones.fallarCambio = true
  const e = mapearMenu({ ...env.fila(), relMenuItem: [] } as unknown as Parameters<typeof mapearMenu>[0]); e.reordenar(e.orden, despues)
  await assert.rejects(new PrismaMenus(env.db).guardar(e, antes, contexto), /modificad/)
  assert.equal(env.auditorias.length, 0)
})

function datosParaCrear(env: ReturnType<typeof entorno>) {
  const e = mapearMenu({ ...env.fila(), relMenuItem: [] } as unknown as Parameters<typeof mapearMenu>[0])
  return { empresaId: e.empresaId, grupo: e.grupo, ruta: e.ruta, icono: e.icono, mostrar: e.mostrar, orden: e.orden, cargarSubmenu: e.cargarSubmenu, destino: e.destino }
}

test('menus: crear genera ID, fecha y auditoría', async () => {
  const env = entorno('menu')
  const resultado = await new PrismaMenus(env.db).crear(datosParaCrear(env), contexto)
  assert.equal(resultado.id, 99n)
  assert.equal(resultado.actualizadoEn?.getTime(), despues.getTime())
  assert.equal(env.auditorias.length, 1)
  assert.ok(env.auditorias[0].includes('Creación'))
})

test('menus: crear con permiso revocado no persiste', async () => {
  const env = entorno('menu'); env.opciones.permiso = false
  await assert.rejects(new PrismaMenus(env.db).crear(datosParaCrear(env), contexto), /Acceso denegado/)
  assert.equal(env.consultas.filter(x => x.metodo === 'create').length, 0)
})

test('menus: auditoría fallida revierte la creación', async () => {
  const env = entorno('menu'); env.opciones.fallarAuditoria = true
  const cantidad = env.tablas.menu.length
  await assert.rejects(new PrismaMenus(env.db).crear(datosParaCrear(env), contexto), /Fallo auditoría/)
  assert.equal(env.tablas.menu.length, cantidad)
})

test('menús: eliminar con ítems activos se rechaza', async () => {
  const env = entorno('menu'); env.tablas.menuItem[0].menuId = 2n
  const e = mapearMenu({ ...env.fila(), relMenuItem: [] } as unknown as Parameters<typeof mapearMenu>[0]); e.eliminar(despues)
  await assert.rejects(new PrismaMenus(env.db).guardar(e, antes, contexto), /ítems activos/)
})
test('menús: destino de otra empresa se rechaza', async () => {
  const env = entorno('menu'); env.tablas.producto[0].empresaId = 9n
  await assert.rejects(new PrismaMenus(env.db).crear(datosParaCrear(env), contexto), /otra empresa/)
})
test('menús: consultas reconstruyen todos los ítems del agregado', async () => {
  const env = entorno('menu'); env.tablas.menuItem[0].menuId = 2n
  const e = await new PrismaMenus(env.db).obtener(2n)
  assert.equal(e?.itemsOrdenados.length, 1)
  const listados = await new PrismaMenus(env.db).listar({})
  assert.equal(listados.find(x => x.id === 2n)?.itemsOrdenados.length, 1)
})

test('menús: no descarta silenciosamente modificaciones de ítems', async () => {
  const env = entorno('menu'); env.tablas.menuItem[0].menuId = 2n
  const repo = new PrismaMenus(env.db); const menu = (await repo.obtener(2n))!
  menu.eliminarItem(2n, despues)
  await assert.rejects(repo.guardar(menu, antes, contexto), /mediante su repositorio/)
  assert.equal(env.tablas.menuItem[0].estado, 'activo')
})
