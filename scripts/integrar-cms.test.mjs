import assert from 'node:assert/strict'
import { test } from 'node:test'
import { integrarCmsEnTexto } from './integrar-cms.mjs'
const antes = `import { registrarRutasCatalogo } from './catalogo.js';
export async function createApp(pruebas?: { casos: CasosIam; config: SeguridadIam; crm?: CasosCrm; catalogo?: CasosCatalogo }) {
  const db = pruebas ? null : crearClienteIam('');
  const casos = pruebas?.casos;
  const config = pruebas?.config;
  await app.register(async scope => registrarRutasCatalogo(scope));
  app.get('/api/health', async () => ({ status: 'ok' }));
  return app;
}`
test('integración CMS preserva registro Catálogo y opciones existentes', () => {
  const despues = integrarCmsEnTexto(antes)
  assert.ok(despues.includes('catalogo?: CasosCatalogo; cms?: CasosCms'))
  assert.ok(despues.includes('await app.register(async scope => registrarRutasCatalogo(scope));'))
  assert.ok(despues.includes('registrarRutasCms(scope, pruebas?.cms ?? componerCms(db!), casos, config)'))
})
test('integración CMS repetida es idempotente', () => {
  const despues = integrarCmsEnTexto(antes)
  assert.equal(integrarCmsEnTexto(despues), despues)
})
test('integración no altera estructuras desconocidas o integraciones parciales', () => {
  assert.throws(() => integrarCmsEnTexto('export async function createApp() {}'), /variable db/)
  assert.throws(() => integrarCmsEnTexto(antes.replace('createApp(pruebas?:', 'createApp(otra?:')), /Firma/)
  assert.throws(() => integrarCmsEnTexto(antes + '\ncomponerCms(db);'), /distinta/)
})
