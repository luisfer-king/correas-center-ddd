import type { FastifyInstance } from 'fastify'
import type { CasosIam } from '../infrastructure/componer-iam.js'
import { errors, lista, protegido, usuarioParams, usuarioRolParams, usuarioSchema } from './esquemas-iam.js'
import { usuarioDto } from './salidas-iam.js'
import { exigirOrigen, exigirSesion, type SeguridadIam } from './seguridad-http.js'

type Id = { id: string }
type Rol = { id: string; rolId: string }
const ok = { type: 'object', required: ['ok'], properties: { ok: { type: 'boolean' } } }
export function rutasUsuarios(app: FastifyInstance, casos: CasosIam, config: SeguridadIam) {
    const actor = exigirSesion(casos, config)
    const origen = exigirOrigen(config)
    const base = { tags: ['IAM · Usuarios'], security: protegido }
    app.get('/api/portal/iam/usuarios', {
        schema: { ...base, summary: 'Listar perfiles de usuarios', response: { 200: lista(usuarioSchema), ...errors } },
    }, async (req, reply) => {
        const id = await actor(req, reply); if (!id) return reply
        return (await casos.listarUsuarios.ejecutar(id)).map(usuarioDto)
    })
    app.get<{ Params: Id }>('/api/portal/iam/usuarios/:id', {
        schema: {
            ...base, summary: 'Detalle de usuario y sus roles', params: usuarioParams,
            response: { 200: usuarioSchema, ...errors }
        },
    }, async (req, reply) => {
        const id = await actor(req, reply); if (!id) return reply
        return usuarioDto(await casos.obtenerUsuario.ejecutar(id, req.params.id))
    })
    app.put<{ Params: Rol }>('/api/portal/iam/usuarios/:id/roles/:rolId', {
        onRequest: origen, schema: {
            ...base, summary: 'Asignar rol vigente al usuario', params: usuarioRolParams,
            response: { 200: ok, ...errors }
        },
    }, async (req, reply) => {
        const id = await actor(req, reply); if (!id) return reply
        await casos.asignarRol.ejecutar(id, req.params.id, BigInt(req.params.rolId))
        return { ok: true }
    })
    app.patch<{ Params: Rol }>('/api/portal/iam/usuarios/:id/roles/:rolId/retirar', {
        onRequest: origen, schema: {
            ...base, summary: 'Inactivar vínculo usuario rol', params: usuarioRolParams,
            response: { 200: ok, ...errors }
        },
    }, async (req, reply) => {
        const id = await actor(req, reply); if (!id) return reply
        await casos.retirarRol.ejecutar(id, req.params.id, BigInt(req.params.rolId))
        return { ok: true }
    })
}