import Fastify from 'fastify'
import assert from 'node:assert/strict'
import { test } from 'node:test'
import type { CasosIam } from '../../../identity-access-management/infrastructure/componer-iam.js'
import type { SeguridadIam } from '../../../identity-access-management/presentation/seguridad-http.js'
import type { CasosCrm } from '../../infrastructure/componer-crm.js'
import { rutasContactos } from '../rutas-contactos.js'
import { rutasSuscriptores } from '../rutas-suscriptores.js'

for (const recurso of ['contactos', 'suscriptores'] as const) test(`${recurso}: solo lecturas y cambios de estado en el portal`, async () => {
    const app = Fastify()
    const ejecutar = async () => undefined
    const casos = {
        [recurso]: {
            respondido: { ejecutar }, archivar: { ejecutar },
            activar: { ejecutar }, inactivar: { ejecutar }, desuscribir: { ejecutar }
        }
    } as unknown as CasosCrm
    const config = {} as SeguridadIam
    try {
        ; (recurso === 'contactos' ? rutasContactos : rutasSuscriptores)(app, casos, {} as CasosIam, config)
        await app.ready()
        const base = `/api/portal/crm/${recurso}`
        assert.equal(app.hasRoute({ method: 'GET', url: base }), true)
        assert.equal(app.hasRoute({ method: 'GET', url: `${base}/:id` }), true)
        assert.equal(app.hasRoute({ method: 'POST', url: base }), false)
        assert.equal(app.hasRoute({ method: 'PATCH', url: `${base}/:id` }), false)
        assert.equal(app.hasRoute({ method: 'PATCH', url: `${base}/:id/eliminar` }), false)
        for (const estado of recurso === 'contactos' ? ['respondido', 'archivar'] : ['activar', 'inactivar', 'desuscribir'])
            assert.equal(app.hasRoute({ method: 'PATCH', url: `${base}/:id/${estado}` }), true)
    } finally { await app.close() }
})
