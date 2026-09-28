import type { FastifyInstance } from 'fastify'
import type { CasosIam } from '../infrastructure/componer-iam.js'
import { auditoriaSchema, errors, lista, protegido } from './esquemas-iam.js'
import { auditoriaDto } from './salidas-iam.js'
import { exigirSesion, type SeguridadIam } from './seguridad-http.js'

export function rutasAuditoria(app: FastifyInstance, casos: CasosIam, config: SeguridadIam) {
    const actor = exigirSesion(casos, config)
    app.get<{ Querystring: { limite?: number; antesDeId?: string; desde?: string; hasta?: string } }>('/api/portal/iam/auditoria', {
        schema: {
            tags: ['IAM · Auditoría'], summary: 'Leer eventos por cursor', security: protegido,
            querystring: {
                type: 'object', additionalProperties: false, properties: {
                    limite: { type: 'integer', minimum: 1, maximum: 100 },
                    antesDeId: { type: 'string', pattern: '^[1-9][0-9]*$' },
                    desde: { type: 'string', format: 'date-time' }, hasta: { type: 'string', format: 'date-time' }
                }
            },
            response: { 200: lista(auditoriaSchema), ...errors }
        },
    }, async (req, reply) => {
        const id = await actor(req, reply); if (!id) return reply
        const eventos = await casos.listarAuditoria.ejecutar(id, req.query.limite ?? 50,
            req.query.antesDeId ? BigInt(req.query.antesDeId) : null, {
            desde: req.query.desde ? new Date(req.query.desde) : null,
            hasta: req.query.hasta ? new Date(req.query.hasta) : null,
        })
        // Se inserta después de consultar para que la página no incluya su propia lectura.
        await casos.registrarLectura.ejecutar(id, 'auditoria')
        return eventos.map(auditoriaDto)
    })
}