import type { FastifyReply, FastifyRequest } from 'fastify';
import type { CasosIam } from '../infrastructure/componer-iam.js';

export type SeguridadIam = { origen: string; cookie: string; secure: boolean }

export function opcionesCookie(config: SeguridadIam) {
    return {
        httpOnly: true, secure: config.secure, sameSite: 'strict' as const,
        path: '/', maxAge: 15 * 60
    }
}

export function exigirOrigen(config: SeguridadIam) {
    return async (request: FastifyRequest, reply: FastifyReply) => {
        if (request.headers.origin !== config.origen || request.headers['x-portal-request'] !== '1') {
            return reply.code(403).send({ error: 'Origen de solicitud no autorizado' })
        }
    }
}

export function exigirSesion(casos: CasosIam, config: SeguridadIam) {
    return async (request: FastifyRequest, reply: FastifyReply): Promise<string | void> => {
        const jwt = request.cookies[config.cookie]
        if (!jwt) { reply.code(401).send({ error: 'Sesión requerida' }); return }
        try { return (await casos.comprobar.ejecutar(jwt)).usuarioId }
        catch (error) {
            if (error instanceof Error && error.message === 'Sesión inválida') {
                reply.code(401).send({ error: 'Sesión inválida' }); return
            }
            throw error
        }
    }
}