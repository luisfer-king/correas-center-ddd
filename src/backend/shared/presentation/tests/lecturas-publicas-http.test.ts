import assert from 'node:assert/strict'
import { test } from 'node:test'
import Fastify from 'fastify'
import rateLimit from '@fastify/rate-limit'
import { LeerPublico } from '../../application/lectura-publica.js'
import { registrarLecturaPublica } from '../lecturas-publicas-http.js'
import { consultaPublica } from '../../../../frontend/shared/api/consulta-publica.js'

test('empresa no publicada: no ejecutar ninguna consulta de contenido', async () => {
 let consultas = 0
 const caso = new LeerPublico({ obtener: async () => null }, async () => { consultas++; return [] })
 const app = Fastify()
 registrarLecturaPublica(app, '/api/publico/prueba', caso, 42n, 'ninguna', 'Prueba pública')
 try { assert.equal((await app.inject('/api/publico/prueba')).statusCode, 404); assert.equal(consultas, 0) } finally { await app.close() }
})
test('error de persistencia: respuesta genérica sin revelar conexión ni SQL', async () => {
 const caso = new LeerPublico({ obtener: async () => ({ id: '42', nombre: 'Empresa', logo: null }) }, async () => { throw Error('postgres://usuario:clave@servidor SELECT secreto') })
 const app = Fastify()
 registrarLecturaPublica(app, '/api/publico/prueba', caso, 42n, 'ninguna', 'Prueba pública')
 try { const r = await app.inject('/api/publico/prueba'); assert.equal(r.statusCode, 500); assert.doesNotMatch(r.body, /postgres|clave|secreto/); assert.equal(r.headers['cache-control'], 'no-store') } finally { await app.close() }
})
test('límite de solicitudes activado con el plugin que ya usa app.ts', async () => {
 const app = Fastify()
 await app.register(rateLimit, { global: false })
 registrarLecturaPublica(app, '/api/publico/prueba', { ejecutar: async () => [] }, 42n, 'ninguna', 'Prueba pública')
 try { for (let i = 0; i < 120; i++) assert.equal((await app.inject('/api/publico/prueba')).statusCode, 200); assert.equal((await app.inject('/api/publico/prueba')).statusCode, 429) } finally { await app.close() }
})
test('cliente construye consulta con codificación y solo claves admitidas', () => {
 const url = consultaPublica({ q: 'correas & mangueras', productoSlug: 'correas-en-v', limite: 10 })
 const valores = new URLSearchParams(url.slice(1))
 assert.equal(valores.get('q'), 'correas & mangueras'); assert.equal(valores.get('limite'), '10'); assert.equal(consultaPublica({}), '')
})
