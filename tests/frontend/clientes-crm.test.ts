import assert from 'node:assert/strict'
import { test } from 'node:test'
import { crmApi } from '../../src/frontend/features/commercial/api/cliente-crm.js'
import { contactosApi } from '../../src/frontend/features/commercial/api/contactos.js'
import { empresasApi } from '../../src/frontend/features/commercial/api/empresas.js'
import { leadsApi } from '../../src/frontend/features/commercial/api/leads.js'
import { sucursalesApi } from '../../src/frontend/features/commercial/api/sucursales.js'
import { suscriptoresApi } from '../../src/frontend/features/commercial/api/suscriptores.js'

const original = globalThis.fetch
const llamadas: { ruta: string; metodo: string; body?: unknown }[] = []

test('clientes CRM usan rutas separadas, encabezado de escritura y capacidad con recursos', async () => {
    globalThis.fetch = async (entrada, opciones) => {
        llamadas.push({
            ruta: String(entrada), metodo: opciones?.method ?? 'GET',
            body: opciones?.body ? JSON.parse(String(opciones.body)) as unknown : undefined
        })
        const datos = String(entrada).endsWith('/capacidades') ? {
            verEliminados: false,
            recursos: { empresas: { leer: true, gestionar: false } }
        } : { ok: true }
        if (opciones?.method === 'PATCH' || opciones?.method === 'POST')
            assert.equal(new Headers(opciones.headers).get('X-Portal-Request'), '1')
        return new Response(JSON.stringify(datos), { status: 200, headers: { 'Content-Type': 'application/json' } })
    }
    try {
        assert.equal((await crmApi.capacidades()).recursos.empresas.leer, true)
        await empresasApi.listar(2)
        await sucursalesApi.cambiar('15', 'activar')
        await contactosApi.cambiar('8', 'respondido')
        await suscriptoresApi.editar('7', null)
        await leadsApi.asignarResponsable('22222222-2222-4222-8222-222222222222', null)
        assert.deepEqual(llamadas.map(({ ruta, metodo }) => [ruta, metodo]), [
            ['/api/portal/crm/capacidades', 'GET'], ['/api/portal/crm/empresas?pagina=2', 'GET'],
            ['/api/portal/crm/sucursales/15/activar', 'PATCH'], ['/api/portal/crm/contactos/8/respondido', 'PATCH'],
            ['/api/portal/crm/suscriptores/7', 'PATCH'],
            ['/api/portal/crm/leads/22222222-2222-4222-8222-222222222222/responsable', 'PATCH'],
        ])
        assert.deepEqual(llamadas.at(-1)?.body, { responsableId: null })
    } finally { globalThis.fetch = original; llamadas.length = 0 }
})

test('identificadores inválidos no originan solicitudes', async () => {
    globalThis.fetch = async () => { throw new Error('No debe solicitar la API') }
    try {
        assert.throws(() => empresasApi.obtener('../1'), /ID de CRM inválido/)
        assert.throws(() => leadsApi.obtener('1'), /ID de lead inválido/)
        assert.throws(() => contactosApi.listar(0), /Página inválida/)
    } finally { globalThis.fetch = original }
})
