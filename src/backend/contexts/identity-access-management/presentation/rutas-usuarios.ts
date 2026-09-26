import type { FastifyInstance } from 'fastify'
import type { CasosIam } from '../infrastructure/componer-iam.js'
import { errors, lista, protegido, usuarioParams, usuarioRolParams, usuarioSchema } from './esquemas-iam.js'
import { usuarioDto } from './salidas-iam.js'
import { exigirOrigen, exigirSesion, type SeguridadIam } from './seguridad-http.js'

type Id = { id: string }
type Rol = { id: string; rolId: string }
const ok = { type: 'object', required: ['ok'], properties: { ok: { type: 'boolean' } } }
const campos = {
    nombreCompleto: { type: 'string', minLength: 1, maxLength: 160 },
    email: { type: 'string', format: 'email', maxLength: 254 },
    telefono: { type: 'string', nullable: true, maxLength: 40 }
}
const editarBody = {
    type: 'object', additionalProperties: false, required: ['nombreCompleto', 'email', 'telefono'],
    properties: campos
}
const crearBody = {
    ...editarBody, required: [...editarBody.required, 'password'],
    properties: { ...campos, password: { type: 'string', minLength: 12, maxLength: 256 } }
}
export function rutasUsuarios(app: FastifyInstance, casos: CasosIam, config: SeguridadIam) {
    const actor = exigirSesion(casos, config)
    const origen = exigirOrigen(config)
    const base = { tags: ['IAM · Usuarios'], security: protegido }
    app.get('/api/portal/iam/usuarios', {
        schema: { ...base, summary: 'Listar perfiles de usuarios', response: { 200: lista(usuarioSchema), ...errors } },
    }, async (req, reply) => {
        const id = await actor(req, reply); if (!id) return reply
        const usuarios = await casos.listarUsuarios.ejecutar(id)
        await casos.registrarLectura.ejecutar(id, 'usuarios')
        return usuarios.map(usuarioDto)
    })
    app.get<{ Params: Id }>('/api/portal/iam/usuarios/:id', {
        schema: {
            ...base, summary: 'Detalle de usuario y sus roles', params: usuarioParams,
            response: { 200: usuarioSchema, ...errors }
        },
    }, async (req, reply) => {
        const id = await actor(req, reply); if (!id) return reply
        const usuario = await casos.obtenerUsuario.ejecutar(id, req.params.id)
        await casos.registrarLectura.ejecutar(id, 'usuarios', usuario.id)
        return usuarioDto(usuario)
    })
    app.post<{ Body: { nombreCompleto: string; email: string; telefono: string | null; password: string } }>(
        '/api/portal/iam/usuarios', {
            onRequest: origen,
        schema: {
            ...base, summary: 'Crear cuenta y perfil de usuario', body: crearBody,
            response: { 201: usuarioSchema, ...errors }
        },
    }, async (req, reply) => {
        const id = await actor(req, reply); if (!id) return reply
        const usuario = await casos.administrarUsuarios.crear(id, req.body)
        return reply.code(201).send(usuarioDto(usuario))
    })
    app.patch<{ Params: Id; Body: { nombreCompleto: string; email: string; telefono: string | null } }>(
        '/api/portal/iam/usuarios/:id', {
            onRequest: origen,
        schema: {
            ...base, summary: 'Editar perfil y correo de acceso', params: usuarioParams,
            body: editarBody, response: { 200: usuarioSchema, ...errors }
        },
    }, async (req, reply) => {
        const id = await actor(req, reply); if (!id) return reply
        return usuarioDto(await casos.administrarUsuarios.editar(id, req.params.id, req.body))
    })
    for (const accion of ['activar', 'inactivar', 'eliminar'] as const) {
        app.patch<{ Params: Id }>(`/api/portal/iam/usuarios/:id/${accion}`, {
            onRequest: origen, schema: {
                ...base, summary: `${accion} usuario`, params: usuarioParams,
                response: { 200: ok, ...errors }
            },
        }, async (req, reply) => {
            const id = await actor(req, reply); if (!id) return reply
            await casos.administrarUsuarios.estado(id, req.params.id, accion)
            return { ok: true }
        })
    }
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
