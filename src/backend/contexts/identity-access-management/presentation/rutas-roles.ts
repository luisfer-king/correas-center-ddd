import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import type { CasosIam } from '../infrastructure/componer-iam.js'
import { errors, idParams, lista, relacionParams, rolSchema } from './esquemas-iam.js'
import { rolDto } from './salidas-iam.js'
import { exigirOrigen, exigirSesion, type SeguridadIam } from './seguridad-http.js'

type Id = { id: string }
type Relacion = { id: string; relacionId: string }
const ok = { type: 'object', required: ['ok'], properties: { ok: { type: 'boolean' } } }

export function rutasRoles(app: FastifyInstance, casos: CasosIam, config: SeguridadIam) {
    const origen = exigirOrigen(config)
    const sesion = exigirSesion(casos, config)
    const actor = (req: FastifyRequest, reply: FastifyReply) => sesion(req, reply)
    const base = { tags: ['IAM · Roles'], security: [{ cookieAuth: [] }], response: errors }
    app.get('/api/portal/iam/roles', {
        schema: { ...base, summary: 'Listar roles', response: { 200: lista(rolSchema), ...errors } },
    }, async (req, reply) => {
        const id = await actor(req, reply); if (!id) return reply
        return (await casos.listarRoles.ejecutar(id)).map(rolDto)
    })
    app.get<{ Params: Id }>('/api/portal/iam/roles/:id', {
        schema: {
            ...base, summary: 'Detalle de rol y permisos asignados', params: idParams,
            response: { 200: rolSchema, ...errors }
        },
    }, async (req, reply) => {
        const id = await actor(req, reply); if (!id) return reply
        return rolDto(await casos.obtenerRol.ejecutar(id, BigInt(req.params.id)))
    })
    app.post<{ Body: { nombre: string; slug: string; descripcion: string | null } }>('/api/portal/iam/roles', {
        onRequest: origen,
        schema: {
            ...base, summary: 'Crear un rol no sistémico', body: {
                type: 'object', additionalProperties: false,
                required: ['nombre', 'slug', 'descripcion'], properties: {
                    nombre: { type: 'string', minLength: 1, maxLength: 120 },
                    slug: { type: 'string', minLength: 1, maxLength: 120 }, descripcion: { type: 'string', nullable: true, maxLength: 2000 }
                }
            },
            response: { 201: rolSchema, ...errors }
        },
    }, async (req, reply) => {
        const id = await actor(req, reply); if (!id) return reply
        const rol = await casos.crearRol.ejecutar(id, req.body)
        return reply.code(201).send(rolDto(rol))
    })
    app.patch<{ Params: Id; Body: { nombre: string; descripcion: string | null } }>('/api/portal/iam/roles/:id', {
        onRequest: origen,
        schema: {
            ...base, summary: 'Editar un rol', params: idParams,
            body: {
                type: 'object', additionalProperties: false, required: ['nombre', 'descripcion'],
                properties: {
                    nombre: { type: 'string', minLength: 1, maxLength: 120 },
                    descripcion: { type: 'string', nullable: true, maxLength: 2000 }
                }
            },
            response: { 200: rolSchema, ...errors }
        },
    }, async (req, reply) => {
        const id = await actor(req, reply); if (!id) return reply
        return rolDto(await casos.editarRol.ejecutar(id, BigInt(req.params.id), req.body.nombre, req.body.descripcion))
    })
    const cambios = [
        { ruta: 'activar', descripcion: 'Activar rol inactivo', ejecutar: casos.activarRol.ejecutar.bind(casos.activarRol) },
        { ruta: 'inactivar', descripcion: 'Inactivar rol no sistémico', ejecutar: casos.inactivarRol.ejecutar.bind(casos.inactivarRol) },
        { ruta: 'eliminar', descripcion: 'Baja lógica de rol no sistémico', ejecutar: casos.eliminarRol.ejecutar.bind(casos.eliminarRol) },
    ] as const
    for (const cambio of cambios) app.patch<{ Params: Id }>(`/api/portal/iam/roles/:id/${cambio.ruta}`, {
        onRequest: origen, schema: {
            ...base, summary: cambio.descripcion, params: idParams,
            response: { 200: ok, ...errors }
        },
    }, async (req, reply) => {
        const id = await actor(req, reply); if (!id) return reply
        await cambio.ejecutar(id, BigInt(req.params.id)); return { ok: true }
    })
    app.put<{ Params: Relacion }>('/api/portal/iam/roles/:id/permisos/:relacionId', {
        onRequest: origen, schema: {
            ...base, summary: 'Asignar permiso vigente a rol', params: relacionParams,
            response: { 200: ok, ...errors }
        },
    }, async (req, reply) => {
        const id = await actor(req, reply); if (!id) return reply
        await casos.asignarPermiso.ejecutar(id, BigInt(req.params.id), BigInt(req.params.relacionId))
        return { ok: true }
    })
    app.patch<{ Params: Relacion }>('/api/portal/iam/roles/:id/permisos/:relacionId/retirar', {
        onRequest: origen, schema: {
            ...base, summary: 'Inactivar asignación de permiso', params: relacionParams,
            response: { 200: ok, ...errors }
        },
    }, async (req, reply) => {
        const id = await actor(req, reply); if (!id) return reply
        await casos.retirarPermiso.ejecutar(id, BigInt(req.params.id), BigInt(req.params.relacionId))
        return { ok: true }
    })
}