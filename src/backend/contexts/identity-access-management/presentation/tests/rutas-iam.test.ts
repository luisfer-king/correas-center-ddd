import swagger from '@fastify/swagger'
import Fastify from 'fastify'
import assert from 'node:assert/strict'
import { test } from 'node:test'
import type { CasosIam } from '../../infrastructure/componer-iam.js'
import { registrarRutasIam } from '../registrar-rutas-iam.js'

test('IAM HTTP: sin cookie devuelve 401, origen ajeno 403, sin filtrar contraseñas', async () => {
    const app = Fastify()
    await app.register(swagger, {
        openapi: {
            openapi: '3.0.3',
            info: { title: 'test', version: '1' },
            components: { securitySchemes: { cookieAuth: { type: 'apiKey', in: 'cookie', name: 'cc_test' } } }
        }
    })
    app.addHook('onRequest', (request, _reply, done) => {
        request.cookies = request.headers.cookie === 'cc_test=falso' ? { cc_test: 'falso' } : {}
        done()
    })
    const casos = {
        comprobar: { ejecutar: async () => { throw new Error('Sesión inválida') } },
        iniciar: { ejecutar: async () => { throw new Error('Credenciales inválidas') } },
        activarRol: { ejecutar: async () => { } },
        inactivarRol: { ejecutar: async () => { } },
        eliminarRol: { ejecutar: async () => { } },
    } as unknown as CasosIam
    await app.register(async (scope) => registrarRutasIam(scope, casos,
        { origen: 'http://localhost:5173', cookie: 'cc_test', secure: false }))
    try {
        const sinSesion = await app.inject({ method: 'GET', url: '/api/portal/iam/roles' })
        assert.equal(sinSesion.statusCode, 401)
        const falsa = await app.inject({
            method: 'GET', url: '/api/portal/iam/roles',
            headers: { cookie: 'cc_test=falso' }
        })
        assert.equal(falsa.statusCode, 401)
        const ajeno = await app.inject({
            method: 'POST', url: '/api/iam/sesion',
            headers: { origin: 'https://malicioso.example', 'x-portal-request': '1', 'content-type': 'application/json' },
            payload: { email: 'admin@ejemplo.com', password: 'no-exponer' }
        })
        assert.equal(ajeno.statusCode, 403)
        assert.doesNotMatch(ajeno.body, /no-exponer/)
        const especificacion = app.swagger() as { paths: Record<string, Record<string, unknown>> }
        assert.ok(especificacion.paths['/api/portal/iam/roles']?.get)
        assert.ok(especificacion.paths['/api/iam/sesion']?.post)
        assert.ok(especificacion.paths['/api/portal/iam/auditoria']?.get)
    } finally { await app.close() }
})