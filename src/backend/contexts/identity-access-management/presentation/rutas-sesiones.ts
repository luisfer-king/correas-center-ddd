import type { FastifyInstance } from 'fastify'
import type { CasosIam } from '../infrastructure/componer-iam.js'
import { errors, errorSchema } from './esquemas-iam.js'
import { exigirOrigen, exigirSesion, opcionesCookie, type SeguridadIam } from './seguridad-http.js'

export function rutasSesiones(app: FastifyInstance, casos: CasosIam, config: SeguridadIam) {
    const origen = exigirOrigen(config)
    const actor = exigirSesion(casos, config)
    app.post<{ Body: { email: string; password: string } }>('/api/iam/sesion', {
        config: { rateLimit: { max: 5, timeWindow: '1 minute' } },
        schema: {
            tags: ['IAM · Sesiones'], summary: 'Iniciar sesión del portal',
            description: 'Requiere Origin y X-Portal-Request: 1; escribe JWT en cookie HttpOnly. No devuelve el token.',
            body: {
                type: 'object', additionalProperties: false, required: ['email', 'password'],
                properties: {
                    email: { type: 'string', format: 'email', maxLength: 254 },
                    password: { type: 'string', minLength: 1, maxLength: 1024 }
                }
            },
            response: { 200: { type: 'object', required: ['ok'], properties: { ok: { type: 'boolean' } } }, ...errors }
        },
        onRequest: origen,
    }, async (request, reply) => {
        const token = await casos.iniciar.ejecutar(request.body.email, request.body.password)
        reply.setCookie(config.cookie, token, opcionesCookie(config))
        return { ok: true }
    })
    app.get('/api/iam/sesion', {
        schema: {
            tags: ['IAM · Sesiones'], summary: 'Comprobar sesión vigente', security: [{ cookieAuth: [] }],
            response: {
                200: {
                    type: 'object', required: ['usuarioId'],
                    properties: { usuarioId: { type: 'string', format: 'uuid' } }
                },
                401: errorSchema, 500: errorSchema
            }
        },
    }, async (request, reply) => {
        const usuarioId = await actor(request, reply)
        if (!usuarioId) return reply
        return { usuarioId }
    })
    app.post('/api/iam/sesion/cerrar', {
        schema: {
            tags: ['IAM · Sesiones'], summary: 'Revocar sesión y borrar cookie',
            security: [{ cookieAuth: [] }], response: { 204: { type: 'null' }, ...errors }
        },
        onRequest: origen,
    }, async (request, reply) => {
        try {
            const jwt = request.cookies[config.cookie]
            if (jwt) await casos.cerrar.ejecutar(jwt)
        } catch (error) {
            if (!(error instanceof Error && error.message === 'Sesión inválida')) throw error
        } finally {
            reply.clearCookie(config.cookie, { path: '/', secure: config.secure, sameSite: 'strict', httpOnly: true })
        }
        return reply.code(204).send()
    })
}