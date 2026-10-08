import { test } from 'node:test'
import assert from 'node:assert/strict'
import { integrar } from './integrar-vista-publica.mjs'
const app = 'const db = null;\nexport function createApp() { return app; }'
const rutas = `import { PortadaTemporal } from './portada-temporal'\n<Route path="/" element={<PortadaTemporal />} />\n<Route path="/portal"><Route index element={<PortalBase />} /><Route path="cms/menus" element={<ListadoMenu />} /></Route>`
test('conserva portal e integra rutas públicas explícitas', () => { const r = integrar(app, rutas); assert.ok(r.rutas.includes('<Route index element={<PortalBase />} />')); assert.ok(r.rutas.includes('cms/menus')); assert.ok(r.rutas.includes('/products/:slug/:categoria')); assert.ok(!r.rutas.includes('cms/*')); assert.ok(r.app.includes('if (db) registrarRutasPublicasCms')); assert.ok(!r.rutas.includes('import { PortadaTemporal }')) })
test('integración repetida no duplica rutas', () => { const r = integrar(app, rutas); assert.deepEqual(integrar(r.app, r.rutas), r) })
test('no sobrescribe una vista pública existente', () => assert.throws(() => integrar(app, rutas.replace('PortadaTemporal />', 'MiVista />'))))
test('detecta rutas en conflicto antes de escribir', () => assert.throws(() => integrar(app, rutas + '<Route path="/products" element={<Catalogo />} />')))
