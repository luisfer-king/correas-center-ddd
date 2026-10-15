import assert from 'node:assert/strict'
import { test } from 'node:test'
import { integrarRutasPublicas } from './integrar-fase4-entrega2.mjs'
const base = `import { VistaPublica } from '../features/publico/presentation/entrada-publica'
import { BrowserRouter, Navigate, Outlet } from 'react-router-dom'
function Rutas() { return <><Route path="/" element={<VistaPublica />} />
    <Route path="/portal" element={<PortalProtegido />} />
    <Route path="*" element={<Navigate to="/" replace />} /></> }
`
test('añade páginas públicas conservando portal y es idempotente',()=>{
 const resultado = integrarRutasPublicas(base);assert.ok(resultado.includes('path="/branches"'));assert.ok(resultado.includes('path="/portal" element={<PortalProtegido />'));assert.ok(resultado.includes('path="*" element={<VistaPublica />'))
 assert.equal(integrarRutasPublicas(resultado),resultado)
})
test('router incompatible se rechaza antes de escribir',()=>assert.throws(()=>integrarRutasPublicas('export function Rutas() {}')))
