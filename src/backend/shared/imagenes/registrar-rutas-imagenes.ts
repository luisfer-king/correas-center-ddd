import type { FastifyInstance, FastifyReply, FastifyRequest, onRequestHookHandler } from 'fastify'
import { AlmacenImagenes, ImagenInvalida, MAX_BYTES_IMAGEN } from './almacen-imagenes.js'
export function registrarRutasImagenes(app: FastifyInstance, opciones: {
  rutaCarga: string; rutaPublica: string; directorio: string; recursos: readonly string[]
  origen: onRequestHookHandler
  autorizar: (req: FastifyRequest, reply: FastifyReply, recurso: string) => Promise<boolean>
}) {
  const almacen = new AlmacenImagenes(opciones.directorio, opciones.recursos)
  app.post<{ Params: { recurso: string }; Body: { base64: string } }>(`${opciones.rutaCarga}/:recurso`, {
    bodyLimit: Math.ceil(MAX_BYTES_IMAGEN / 3) * 4 + 1024,
    onRequest: async (req, reply) => {
      // El adaptador de origen del proyecto es síncrono/async, sin callback.
      await (opciones.origen as (req: FastifyRequest, reply: FastifyReply) => unknown)(req, reply)
      if (reply.sent) return
      if (!opciones.recursos.includes(req.params.recurso)) return reply.code(404).send({ error: 'Elemento no disponible.' })
      if (!await opciones.autorizar(req, reply, req.params.recurso) && !reply.sent)
        return reply.code(403).send({ error: 'Acceso denegado' })
    },
    schema: { body: { type: 'object', additionalProperties: false, required: ['base64'],
      properties: { base64: { type: 'string', minLength: 4, maxLength: Math.ceil(MAX_BYTES_IMAGEN / 3) * 4 } } } },
  }, async (req, reply) => {
    try {
      const nombre = await almacen.guardar(req.params.recurso, req.body.base64)
      return reply.code(201).send({ url: `${opciones.rutaPublica}/${req.params.recurso}/${nombre}` })
    } catch (error) {
      if (error instanceof ImagenInvalida) return reply.code(400).send({ error: error.message })
      throw error
    }
  })
  app.get<{ Params: { recurso: string; nombre: string } }>(`${opciones.rutaPublica}/:recurso/:nombre`, async (req, reply) => {
    try {
      const imagen = await almacen.leer(req.params.recurso, req.params.nombre)
      return reply.type('image/png').header('X-Content-Type-Options', 'nosniff')
        .header('Cache-Control', 'public, max-age=31536000, immutable').send(imagen)
    } catch (error) {
      if (error instanceof ImagenInvalida || (error as NodeJS.ErrnoException).code === 'ENOENT')
        return reply.code(404).send({ error: 'Imagen no disponible.' })
      throw error
    }
  })
}
