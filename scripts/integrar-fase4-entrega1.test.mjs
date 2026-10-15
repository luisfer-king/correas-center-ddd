import assert from 'node:assert/strict'
import { test } from 'node:test'
import { integrarTextoPublicacion } from './integrar-fase4-entrega1.mjs'
const base = `import { empresaPublicaDesdeEntorno } from './cms.js'
export async function createApp(pruebas?: { casos: CasosIam; gamas?: CasosGamas }) {
  // Bloque de administración existente: debe conservarse.
  app.get('/api/portal/ejemplo', manejador);
  registrarRutasPublicasCms(app, caso, empresaPublicaDesdeEntorno());
  return app;
}
`
test('integra una sola vez y conserva rutas administrativas y vista pública existente', () => {
 const nuevo = integrarTextoPublicacion(base)
 assert.ok(nuevo.includes("app.get('/api/portal/ejemplo', manejador);"));assert.ok(nuevo.includes('registrarRutasPublicasCms(app, caso, empresaPublicaDesdeEntorno());'))
 assert.ok(nuevo.includes('empresaPublicaId?: bigint'));assert.equal(integrarTextoPublicacion(nuevo),nuevo)
})
test('base distinta o integración parcial se rechaza antes de escribir', () => {
 assert.throws(() => integrarTextoPublicacion('export function app() {}'))
 assert.throws(() => integrarTextoPublicacion(base + '// Fase 4, entrega 1: consultas públicas por contexto, sin sesión IAM.'))
})
