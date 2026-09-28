import type { FastifyInstance } from 'fastify'
import type { CasosIam } from '../infrastructure/componer-iam.js'
import { errors, protegido, usuarioSchema } from './esquemas-iam.js'
import { usuarioDto } from './salidas-iam.js'
import { exigirOrigen, exigirSesion, type SeguridadIam } from './seguridad-http.js'

export function rutasMiPerfil(app: FastifyInstance, casos: CasosIam, config: SeguridadIam) {
    const actor = exigirSesion(casos, config)
    const origen = exigirOrigen(config)
    const base = { tags: ['IAM · Mi perfil'], security: protegido }
    app.get('/api/portal/iam/mi-perfil', {
        schema: { ...base, summary: 'Consultar mi perfil', response: { 200: usuarioSchema, ...errors } },
    }, async (req, reply) => {
        const id = await actor(req, reply); if (!id) return reply
        const perfil = await casos.miPerfil.obtener(id)
        await casos.registrarLectura.ejecutar(id, 'mi-perfil', id)
        return usuarioDto(perfil)
    })
    app.patch<{ Body: { nombreCompleto: string; telefono: string | null } }>('/api/portal/iam/mi-perfil', {
        onRequest: origen, schema: {
            ...base, summary: 'Actualizar mis datos personales',
            body: {
                type: 'object', additionalProperties: false, required: ['nombreCompleto', 'telefono'],
                properties: {
                    nombreCompleto: { type: 'string', minLength: 1, maxLength: 160 },
                    telefono: { type: 'string', nullable: true, maxLength: 40 }
                }
            },
            response: { 200: usuarioSchema, ...errors }
        },
    }, async (req, reply) => {
        const id = await actor(req, reply); if (!id) return reply
        return usuarioDto(await casos.miPerfil.editar(id, req.body))
    })
    app.post<{ Body: { actual: string; nueva: string } }>('/api/portal/iam/mi-perfil/clave', {
        onRequest: origen, config: { rateLimit: { max: 5, timeWindow: '1 minute' } },
        schema: {
            ...base, summary: 'Cambiar mi contraseña verificando la actual',
            body: {
                type: 'object', additionalProperties: false, required: ['actual', 'nueva'],
                properties: {
                    actual: { type: 'string', minLength: 1, maxLength: 1024 },
                    nueva: { type: 'string', minLength: 12, maxLength: 256 }
                }
            },
            response: { 200: { type: 'object', required: ['ok'], properties: { ok: { type: 'boolean' } } }, ...errors }
        },
    }, async (req, reply) => {
        const id = await actor(req, reply); if (!id) return reply
        await casos.miPerfil.cambiarClave(id, req.body.actual, req.body.nueva)
        return { ok: true }
    })
}
