import assert from 'node:assert/strict'
import { after, test } from 'node:test'
import { ErrorApi, solicitarApi } from '../../src/frontend/shared/api/cliente-http'

const original = globalThis.fetch
after(() => { globalThis.fetch = original })

test('POST envía cookie del mismo origen y encabezado requerido', async () => {
    let ruta = ''
    let opciones: RequestInit = {}
    globalThis.fetch = async (input, init) => {
        ruta = String(input)
        opciones = init ?? {}
        return new Response(JSON.stringify({ ok: true }), {
            headers: { 'content-type': 'application/json' }, status: 200,
        })
    }
    assert.deepEqual(await solicitarApi<{ ok: boolean }>('/api/iam/sesion', {
        metodo: 'POST', cuerpo: { email: 'ejemplo@local.test', password: 'ejemplo' },
    }), { ok: true })
    assert.equal(ruta, '/api/iam/sesion')
    assert.equal(opciones.credentials, 'same-origin')
    assert.equal(new Headers(opciones.headers).get('X-Portal-Request'), '1')
    assert.equal(new Headers(opciones.headers).get('Content-Type'), 'application/json')
    assert.equal(new Headers(opciones.headers).get('Origin'), null)
})

test('GET no envía encabezado de mutación y 204 no intenta leer JSON', async () => {
    globalThis.fetch = async (_input, init) => {
        assert.equal(new Headers(init?.headers).get('X-Portal-Request'), null)
        return new Response('[]', { headers: { 'content-type': 'application/json' } })
    }
    assert.deepEqual(await solicitarApi<unknown[]>('/api/portal/iam/roles'), [])
    globalThis.fetch = async () => new Response(null, { status: 204 })
    assert.equal(await solicitarApi<void>('/api/iam/sesion/cerrar', { metodo: 'POST' }), undefined)
})

test('el estado HTTP y el error llegan al consumidor', async () => {
    globalThis.fetch = async () => new Response(JSON.stringify({ error: 'Sesión inválida' }), {
        status: 401, headers: { 'content-type': 'application/json' },
    })
    await assert.rejects(solicitarApi('/api/iam/sesion'), (error: unknown) =>
        error instanceof ErrorApi && error.estado === 401 && error.message === 'Sesión inválida')
})