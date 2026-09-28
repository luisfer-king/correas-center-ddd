import Fastify from 'fastify'
import assert from 'node:assert/strict'
import { test } from 'node:test'
import type { CasosIam } from '../../infrastructure/componer-iam.js'
import { contextoAuditoriaHttp } from '../../infrastructure/contexto-auditoria-http.js'
import { registrarRutasIam } from '../registrar-rutas-iam.js'

const actorId = '11111111-1111-4111-8111-111111111111'

test('GET autorizados registran lectura; GET rechazados no la registran', async () => {
    const app = Fastify()
    app.addHook('onRequest', (req, _reply, done) => { req.cookies = { cc_test: 'sesion-prueba' }; done() })
    const lecturas: { recurso: string; registro: string | null }[] = []
    const procedencias: { ipAddress: string | null; userAgent: string | null }[] = []
    let orden: string[] = []
    const casos = {
        comprobar: { ejecutar: async () => ({ usuarioId: actorId }) },
        activarRol: { ejecutar: async () => { } },
        inactivarRol: { ejecutar: async () => { } },
        eliminarRol: { ejecutar: async () => { } },
        registrarLectura: {
            ejecutar: async (_actor: string, recurso: string, registro: string | null = null) => {
                assert.equal(_actor, actorId)
                lecturas.push({ recurso, registro })
                const contexto = contextoAuditoriaHttp()
                procedencias.push({ ipAddress: contexto?.ipAddress ?? null, userAgent: contexto?.userAgent ?? null })
                orden.push('registrar')
            }
        },
        listarRoles: { ejecutar: async () => [] },
        listarPermisos: { ejecutar: async () => [] },
        listarUsuarios: { ejecutar: async () => { throw new Error('Acceso denegado') } },
        listarAuditoria: {
            ejecutar: async (_actor: string, _limite: number, _cursor: bigint | null,
                rango: { desde: Date | null; hasta: Date | null }) => {
                assert.equal(_actor, actorId)
                assert.equal(rango.desde?.toISOString(), '2026-09-26T04:00:00.000Z')
                assert.equal(rango.hasta?.toISOString(), '2026-09-27T04:00:00.000Z')
                orden.push('consultar')
                return []
            }
        },
    } as unknown as CasosIam
    await app.register(async (scope) => registrarRutasIam(scope, casos,
        { origen: 'http://localhost:5173', cookie: 'cc_test', secure: false }))
    try {
        assert.equal((await app.inject({ method: 'GET', url: '/api/portal/iam/roles' })).statusCode, 200)
        assert.equal((await app.inject({ method: 'GET', url: '/api/portal/iam/permisos' })).statusCode, 200)
        assert.equal((await app.inject({ method: 'GET', url: '/api/portal/iam/usuarios' })).statusCode, 403)
        assert.deepEqual(lecturas.map((x) => x.recurso), ['roles', 'permisos'])
        orden = []
        const auditoria = await app.inject({
            method: 'GET',
            url: '/api/portal/iam/auditoria?limite=26&desde=2026-09-26T04%3A00%3A00.000Z&hasta=2026-09-27T04%3A00%3A00.000Z'
        })
        assert.equal(auditoria.statusCode, 200)
        assert.deepEqual(orden, ['consultar', 'registrar'])
        assert.deepEqual(lecturas.at(-1), { recurso: 'auditoria', registro: null })
        const [primera, segunda] = await Promise.all([
            app.inject({
                method: 'GET', url: '/api/portal/iam/roles', remoteAddress: '198.51.100.11',
                headers: { 'user-agent': 'Navegador A', 'x-forwarded-for': '203.0.113.99' }
            }),
            app.inject({
                method: 'GET', url: '/api/portal/iam/roles', remoteAddress: '198.51.100.12',
                headers: { 'user-agent': 'Navegador B' }
            }),
        ])
        assert.equal(primera.statusCode, 200)
        assert.equal(segunda.statusCode, 200)
        assert.deepEqual(procedencias.slice(-2).sort((a, b) => (a.userAgent ?? '').localeCompare(b.userAgent ?? '')), [
            { ipAddress: '198.51.100.11', userAgent: 'Navegador A' },
            { ipAddress: '198.51.100.12', userAgent: 'Navegador B' },
        ])
    } finally { await app.close() }
})