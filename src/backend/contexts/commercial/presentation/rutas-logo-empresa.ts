import type { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import type { CasosIam } from '../../identity-access-management/infrastructure/componer-iam.js'
import { exigirOrigen, exigirSesion, type SeguridadIam } from '../../identity-access-management/presentation/seguridad-http.js'
import type { CasosCrm } from '../infrastructure/componer-crm.js'

export function rutasLogoEmpresa(app: FastifyInstance, casos: CasosCrm, iam: CasosIam, config: SeguridadIam) {
    const carpeta = resolve(process.env.CRM_LOGOS_DIR || 'storage/crm/logos')
    app.post<{ Body: { base64: string } }>('/api/portal/crm/empresas/logo', {
        bodyLimit: 2800000, onRequest: exigirOrigen(config),
        schema: {
            body: {
                type: 'object', additionalProperties: false, required: ['base64'],
                properties: { base64: { type: 'string', minLength: 4, maxLength: 2796204 } }
            }
        },
    }, async (req, reply) => {
        const actor = await exigirSesion(iam, config)(req, reply)
        if (!actor) return reply
        const capacidades = await casos.capacidades.ejecutar(actor)
        if (!capacidades.recursos.empresas.gestionar) return reply.code(403).send({ error: 'Acceso denegado' })
        const texto = req.body.base64
        if (!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(texto))
            return reply.code(400).send({ error: 'Imagen inválida' })
        const datos = Buffer.from(texto, 'base64')
        const extension = datos.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) ? 'png' :
            datos[0] === 255 && datos[1] === 216 && datos[2] === 255 ? 'jpg' :
                datos.toString('ascii', 0, 4) === 'RIFF' && datos.toString('ascii', 8, 12) === 'WEBP' ? 'webp' : null
        if (!extension || datos.length > 2 * 1024 * 1024) return reply.code(400).send({ error: 'Imagen inválida o superior a 2 MB' })
        await mkdir(carpeta, { recursive: true })
        const nombre = `${randomUUID()}.${extension}`
        await writeFile(resolve(carpeta, nombre), datos, { flag: 'wx' })
        return reply.code(201).send({ url: `/api/public/crm/logos/${nombre}` })
    })
    app.get<{ Params: { nombre: string } }>('/api/public/crm/logos/:nombre', async (req, reply) => {
        const nombre = req.params.nombre
        if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(png|jpg|webp)$/.test(nombre))
            return reply.code(404).send({ error: 'Imagen no disponible' })
        try {
            const datos = await readFile(resolve(carpeta, nombre))
            return reply.header('X-Content-Type-Options', 'nosniff').header('Cache-Control', 'public, max-age=31536000, immutable')
                .type(nombre.endsWith('.png') ? 'image/png' : nombre.endsWith('.jpg') ? 'image/jpeg' : 'image/webp').send(datos)
        } catch (error) {
            if ((error as NodeJS.ErrnoException).code === 'ENOENT') return reply.code(404).send({ error: 'Imagen no disponible' })
            throw error
        }
    })
}
