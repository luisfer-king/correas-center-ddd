import type { FastifyInstance } from 'fastify'
import type { CasosIam } from '../../identity-access-management/infrastructure/componer-iam.js'
import type { SeguridadIam } from '../../identity-access-management/presentation/seguridad-http.js'
import { exigirSesion } from '../../identity-access-management/presentation/seguridad-http.js'
import { conContextoAuditoriaHttp } from '../../identity-access-management/infrastructure/contexto-auditoria-http.js'
import type { CasosCrm } from '../infrastructure/componer-crm.js'
import { registrarErroresCrm } from './errores-http-crm.js'
import { rutasEmpresas } from './rutas-empresas.js'
import { rutasSucursales } from './rutas-sucursales.js'
import { rutasContactos } from './rutas-contactos.js'
import { rutasSuscriptores } from './rutas-suscriptores.js'
import { rutasLeads } from './rutas-leads.js'
import { erroresCrm } from './esquemas-crm.js'

export async function registrarRutasCrm(app: FastifyInstance, casos: CasosCrm, iam: CasosIam,
  config: SeguridadIam) {
  app.addHook('onRequest', (request, _reply, done) => {
    const agente = request.headers['user-agent']?.replace(/[\r\n\u0000-\u001f\u007f]/g, '').slice(0, 2048) || null
    conContextoAuditoriaHttp({ ipAddress: request.ip || null, userAgent: agente }, done)
  })
  registrarErroresCrm(app)
  app.get('/api/portal/crm/capacidades', {
    schema: { tags: ['CRM'], summary: 'Capacidades de CRM del usuario autenticado',
      security: [{ cookieAuth: [] }], response: { 200: { type: 'object', additionalProperties: false,
        required: ['verEliminados', 'recursos'], properties: {
          verEliminados: { type: 'boolean' }, recursos: { type: 'object', additionalProperties: false,
            required: ['empresas','sucursales','contactos','suscriptores','leads'], properties:
              Object.fromEntries(['empresas','sucursales','contactos','suscriptores','leads'].map((recurso) =>
                [recurso, { type: 'object', additionalProperties: false, required: ['leer','gestionar'],
                  properties: { leer: { type: 'boolean' }, gestionar: { type: 'boolean' } } }])) },
        } }, ...erroresCrm } },
  }, async (request, reply) => {
    const actor = await exigirSesion(iam, config)(request, reply); if (!actor) return reply
    const capacidades = await casos.capacidades.ejecutar(actor)
    await casos.registrarLectura.ejecutar(actor, 'portal')
    return capacidades
  })
  rutasEmpresas(app, casos, iam, config)
  rutasSucursales(app, casos, iam, config)
  rutasContactos(app, casos, iam, config)
  rutasSuscriptores(app, casos, iam, config)
  rutasLeads(app, casos, iam, config)
}
