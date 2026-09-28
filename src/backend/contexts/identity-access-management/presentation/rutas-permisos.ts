import type { FastifyInstance } from 'fastify'
import type { CasosIam } from '../infrastructure/componer-iam.js'
import { errors, idParams, lista, permisoSchema, protegido } from './esquemas-iam.js'
import { permisoDto } from './salidas-iam.js'
import { exigirSesion, type SeguridadIam } from './seguridad-http.js'

export function rutasPermisos(app: FastifyInstance, casos: CasosIam, config: SeguridadIam) {
    const actor = exigirSesion(casos, config)
    app.get('/api/portal/iam/permisos', {
        schema: {
            tags: ['IAM · Permisos'], summary: 'Listar permisos', security: protegido,
            response: { 200: lista(permisoSchema), ...errors }
        },
    }, async (req, reply) => {
        const id = await actor(req, reply); if (!id) return reply
        const permisos = await casos.listarPermisos.ejecutar(id)
        await casos.registrarLectura.ejecutar(id, 'permisos')
        return permisos.map(permisoDto)
    })
    app.get<{ Params: { id: string } }>('/api/portal/iam/permisos/:id', {
        schema: {
            tags: ['IAM · Permisos'], summary: 'Detalle de permiso', security: protegido,
            params: idParams, response: { 200: permisoSchema, ...errors }
        },
    }, async (req, reply) => {
        const id = await actor(req, reply); if (!id) return reply
        const permiso = await casos.obtenerPermiso.ejecutar(id, BigInt(req.params.id))
        await casos.registrarLectura.ejecutar(id, 'permisos', permiso.id.toString())
        return permisoDto(permiso)
    })
}