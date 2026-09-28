import cookie from '@fastify/cookie'
import Fastify from 'fastify'
import assert from 'node:assert/strict'
import { test } from 'node:test'
import type { CasosIam } from '../../../identity-access-management/infrastructure/componer-iam.js'
import { contextoAuditoriaHttp } from '../../../identity-access-management/infrastructure/contexto-auditoria-http.js'
import { Empresa } from '../../domain/empresa.js'
import { Lead } from '../../domain/lead.js'
import type { CasosCrm } from '../../infrastructure/componer-crm.js'
import { registrarRutasCrm } from '../registrar-rutas-crm.js'

const actorId = '11111111-1111-4111-8111-111111111111'
const origen = 'http://localhost:5173'
const empresa = new Empresa({
    id: 1n, nombre: 'Correas', logo: null, estado: 'activo',
    fechas: { creadoEn: new Date('2026-09-20'), actualizadoEn: new Date('2026-09-20'), eliminadoEn: null }
})

function preparar(opciones: {
    denegar?: boolean; lecturas?: Array<{
        recurso: string; ip: string | null;
        agente: string | null; registro: string | null
    }>; entradas?: unknown[]
} = {}) {
    const lecturas = opciones.lecturas ?? []
    const entradas = opciones.entradas ?? []
    const entidad = {
        listar: { ejecutar: async () => opciones.denegar ? Promise.reject(new Error('Acceso denegado')) : [empresa] },
        obtener: { ejecutar: async () => empresa },
        crear: { ejecutar: async (_actor: string, datos: unknown) => { entradas.push(datos); return empresa } },
        editar: { ejecutar: async () => empresa }, activar: { ejecutar: async () => { } },
        inactivar: { ejecutar: async () => { } }, eliminar: { ejecutar: async () => { } },
        respondido: { ejecutar: async () => { } }, archivar: { ejecutar: async () => { } },
        desuscribir: { ejecutar: async () => { } }, calificar: { ejecutar: async () => { } },
        descartar: { ejecutar: async () => { } }, asignarResponsable: { ejecutar: async () => empresa },
    }
    const lead = new Lead({
        id: '22222222-2222-4222-8222-222222222222', empresaId: 1n,
        contactoId: 2n, responsableId: null, estado: 'nuevo', creadoEn: new Date('2026-09-20'),
        actualizadoEn: new Date('2026-09-20'), eliminadoEn: null
    })
    const crm = {
        empresas: entidad, sucursales: entidad, contactos: entidad, suscriptores: entidad,
        leads: {
            ...entidad, crear: {
                ejecutar: async (_actor: string, datos: unknown) => {
                    entradas.push(datos); return lead
                }
            }
        }, capacidades: {
            ejecutar: async () => ({
                verEliminados: false,
                recursos: Object.fromEntries(['empresas', 'sucursales', 'contactos', 'suscriptores', 'leads']
                    .map((recurso) => [recurso, { leer: true, gestionar: true }]))
            })
        },
        registrarLectura: {
            ejecutar: async (_actor: string, recurso: string, registro: string | null = null) => {
                assert.equal(_actor, actorId)
                const contexto = contextoAuditoriaHttp()
                lecturas.push({
                    recurso, registro, ip: contexto?.ipAddress ?? null,
                    agente: contexto?.userAgent ?? null
                })
            }
        },
    } as unknown as CasosCrm
    const iam = {
        comprobar: {
            ejecutar: async (jwt: string) => {
                if (jwt !== 'valida') throw new Error('Sesión inválida')
                return { usuarioId: actorId }
            }
        }
    } as unknown as CasosIam
    const app = Fastify({ trustProxy: false })
    return { app, crm, iam, lecturas, entradas }
}

test('protección, origen, validación y auditoría de lecturas CRM', async () => {
    const { app, crm, iam, lecturas } = preparar()
    await app.register(cookie)
    await app.register(async (scope) => registrarRutasCrm(scope, crm, iam,
        { origen, cookie: 'portal', secure: false }))
    try {
        const base = '/api/portal/crm/empresas'
        assert.equal((await app.inject({ method: 'GET', url: base })).statusCode, 401)
        assert.equal((await app.inject({ method: 'GET', url: base, headers: { cookie: 'portal=invalida' } })).statusCode, 401)
        const lista = await app.inject({
            method: 'GET', url: base, headers: {
                cookie: 'portal=valida', 'user-agent': 'Navegador CRM', 'x-forwarded-for': '203.0.113.1',
            }, remoteAddress: '198.51.100.20'
        })
        assert.equal(lista.statusCode, 200)
        assert.equal(lista.json()[0].id, '1')
        assert.deepEqual(lecturas[0], {
            recurso: 'empresas', registro: null,
            ip: '198.51.100.20', agente: 'Navegador CRM'
        })
        assert.equal((await app.inject({ method: 'GET', url: `${base}/1`, headers: { cookie: 'portal=valida' } })).statusCode, 200)
        assert.equal(lecturas[1]?.registro, '1')
        assert.equal((await app.inject({ method: 'POST', url: base, headers: { cookie: 'portal=valida', origin: 'https://otro.example', 'x-portal-request': '1' }, payload: { nombre: 'Ejemplo', logo: null } })).statusCode, 403)
        assert.equal((await app.inject({ method: 'POST', url: base, headers: { cookie: 'portal=valida', origin: origen, 'x-portal-request': '1' }, payload: { nombre: '', logo: null } })).statusCode, 400)
        assert.equal((await app.inject({ method: 'POST', url: base, headers: { cookie: 'portal=valida', origin: origen, 'x-portal-request': '1' }, payload: { nombre: 'Ejemplo', logo: null } })).statusCode, 201)
        assert.equal(lecturas.length, 2)
    } finally { await app.close() }
})

test('lectura rechazada no se registra y las cinco rutas están separadas', async () => {
    const { app, crm, iam, lecturas, entradas } = preparar({ denegar: true })
    await app.register(cookie)
    await app.register(async (scope) => registrarRutasCrm(scope, crm, iam,
        { origen, cookie: 'portal', secure: false }))
    try {
        for (const recurso of ['empresas', 'sucursales', 'contactos', 'suscriptores', 'leads']) {
            const r = await app.inject({ method: 'GET', url: `/api/portal/crm/${recurso}`, headers: { cookie: 'portal=valida' } })
            assert.equal(r.statusCode, 403, recurso)
        }
        assert.equal(lecturas.length, 0)
        const lead = await app.inject({
            method: 'POST', url: '/api/portal/crm/leads',
            headers: { cookie: 'portal=valida', origin: origen, 'x-portal-request': '1' },
            payload: { empresaId: '1', contactoId: '2', responsableId: null }
        })
        assert.equal(lead.statusCode, 201)
        assert.deepEqual(entradas[0], { empresaId: 1n, contactoId: 2n, responsableId: null })
    } finally { await app.close() }
})
