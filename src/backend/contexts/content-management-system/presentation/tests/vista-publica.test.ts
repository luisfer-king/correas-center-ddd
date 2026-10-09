import assert from 'node:assert/strict'
import { test } from 'node:test'
import Fastify from 'fastify'
import type { PrismaClient } from '../../../../generated/prisma/client.js'
import { PrismaVistaPublica } from '../../infrastructure/prisma-vista-publica.js'
import { ObtenerVistaPublica } from '../../application/use-cases/publico/obtener-vista-publica.js'
import { registrarRutasPublicasCms } from '../registrar-rutas-publicas-cms.js'
import { rutaPublica, nombreRuta } from '../../../../../shared/vista-publica.js'
function datos(submenu = 'activo') {
 const llamadas: { modelo: string; consulta: unknown }[] = []
 const filas: Record<string, unknown[]> = {
  menu: [{ id: 99n, grupo: 'Producto', tipoRegistro: 'producto', registroId: 800n, ruta: '/products/correas/', icono: 'Cog', orden: 1, cargarSubmenu: submenu, relMenuItem: [{ id: 88n, ruta: '/products/correas/correas-en-v/', orden: 1 }] }, { id: 100n, grupo: 'Producto', tipoRegistro: 'producto', registroId: 801n, ruta: '/products/otro', icono: null, orden: 2, relMenuItem: [] }],
  producto: [{ id: 800n, nombre: 'Correas industriales' }], industria: [], servicio: [],
  tipoSeccion: [{ id: 5n, slug: 'hero', orden: 1 }], contenidoSeccion: [{ id: 7n, tipoSeccionId: 5n, titulo: 'Bienvenido', subtitulo: null, descripcion: null, imagen: null, metadata: { badge_text: 'Industria' }, orden: 1 }],
 }
 const tx = Object.fromEntries(Object.entries(filas).map(([modelo, valores]) => [modelo, { findMany: async (consulta: unknown) => { llamadas.push({ modelo, consulta }); return valores } }]))
 tx.empresa = { findFirst: async () => ({ id: 42n, nombre: 'Correas Center', logo: null }) } as never
 const db = { $transaction: async (fn: (tx: unknown) => unknown) => fn(tx) } as unknown as PrismaClient
 return { repo: new PrismaVistaPublica(db), llamadas }
}
test('usa ID real, omite referencias inexistentes y serializa IDs como texto', async () => { const { repo } = datos(); const v = await repo.obtener(42n); assert.equal(v?.menus.Producto.length, 1); assert.equal(v?.menus.Producto[0].nombre, 'Correas industriales'); assert.equal(v?.menus.Producto[0].items[0].nombre, 'Correas en v'); assert.doesNotThrow(() => JSON.stringify(v)); assert.equal(v?.secciones[0].subtitulo, null) })
test('submenu activo usa ruta hija', async () => assert.equal((await datos().repo.obtener(42n))?.menus.Producto[0].items[0].ruta, '/products/correas/correas-en-v/'))
test('submenu inactivo conserva hijo y cambia destino al padre', async () => { const v = await datos('inactivo').repo.obtener(42n); assert.equal(v?.menus.Producto[0].items.length, 1); assert.equal(v?.menus.Producto[0].items[0].ruta, '/products/correas/') })
test('filtros de publicación y aislamiento por empresa en consulta', async () => {
 const { repo, llamadas } = datos(); await repo.obtener(42n)
 for (const modelo of ['menu', 'producto', 'industria', 'servicio', 'contenidoSeccion']) {
  const consulta = llamadas.find(c => c.modelo === modelo)?.consulta as { where: Record<string, unknown> }
  assert.equal(consulta.where.empresaId, 42n); assert.equal(consulta.where.estado, 'activo'); assert.equal(consulta.where.eliminadoEn, null)
  if (modelo === 'menu' || modelo === 'contenidoSeccion') assert.equal(consulta.where.mostrar, true)
 }
 const consulta = llamadas.find(c => c.modelo === 'menu')?.consulta as { select: { relMenuItem: { where: unknown } } }
 assert.deepEqual(consulta.select.relMenuItem.where, { estado: 'activo', eliminadoEn: null })
})
test('API pública sin sesión y sin exposición de rutas administrativas', async () => { const app = Fastify(); registrarRutasPublicasCms(app, new ObtenerVistaPublica(datos().repo), 42n); try { const r = await app.inject('/api/publico/vista'); assert.equal(r.statusCode, 200); assert.equal(r.headers['cache-control'], 'no-store'); assert.equal(r.json().empresa.id, '42'); assert.equal((await app.inject('/api/portal/cms/menus')).statusCode, 404) } finally { await app.close() } })
test('empresa no publicada devuelve 404', async () => { const app = Fastify(); registrarRutasPublicasCms(app, new ObtenerVistaPublica({ obtener: async () => null }), 42n); try { assert.equal((await app.inject('/api/publico/vista')).statusCode, 404) } finally { await app.close() } })
test('ID inválido se rechaza', () => assert.throws(() => new ObtenerVistaPublica(datos().repo).ejecutar(0n)))
test('rutas externas y esquemas ejecutables no son enlaces públicos', () => { for (const v of ['javascript:alert(1)', '//externo.test', '/\\externo', '/bad path', null]) assert.equal(rutaPublica(v), null); assert.equal(nombreRuta('/products/correas-en-v/'), 'Correas en v') })
