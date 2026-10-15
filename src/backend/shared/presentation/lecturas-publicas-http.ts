import type { FastifyInstance } from 'fastify'
import type { ConsultaPaginaPublica } from '../../../shared/publico/comun.js'
import { EmpresaNoPublicada } from '../application/lectura-publica.js'
export const esquemaPaginaPublica = { type: 'object', additionalProperties: false, properties: {
 limite: { type: 'integer', minimum: 1, maximum: 100, default: 30 },
 desplazamiento: { type: 'integer', minimum: 0, maximum: 10000, default: 0 },
 q: { type: 'string', minLength: 2, maxLength: 100, pattern: /\S/.source },
 slug: { type: 'string', minLength: 1, maxLength: 255, pattern: /^[^/\\\s]+$/.source },
 productoSlug: { type: 'string', minLength: 1, maxLength: 255, pattern: /^[^/\\\s]+$/.source },
} } as const
export const esquemaPaginaCategoriaPublica = { ...esquemaPaginaPublica, properties:{...esquemaPaginaPublica.properties,slug:{type:'string',minLength:1,maxLength:255,pattern:/^[a-zA-Z0-9_-]+(?:\/[a-zA-Z0-9_-]+)*$/.source}} } as const
export const esquemaSlugPublico = { type: 'object', additionalProperties: false, required: ['slug'], properties: { slug: { type: 'string', minLength: 1, maxLength: 255, pattern: /^[^/\\\s]+$/.source } } } as const
export interface CasoLecturaPublica<T, E> { ejecutar(empresaId: bigint, entrada: E): Promise<T> }
export function registrarLecturaPublica<T, E>(app: FastifyInstance, ruta: string, caso: CasoLecturaPublica<T, E>, empresaId: bigint, entrada: 'pagina' | 'slug' | 'ninguna', tag: string, esquemaPagina: object = esquemaPaginaPublica) {
 app.get<{ Querystring: ConsultaPaginaPublica; Params: { slug: string } }>(ruta, { config: { rateLimit: { max: 120, timeWindow: '1 minute' } }, schema: {
  tags: [tag], summary: 'Lectura pública: ' + ruta.split('/').at(-1), security: [],
  ...(entrada === 'pagina' ? { querystring: esquemaPagina } : entrada === 'slug' ? { params: esquemaSlugPublico } : {}),
 } }, async (req, reply) => {
  reply.header('Cache-Control', 'no-store')
  try {
   const datos = entrada === 'pagina' ? req.query : entrada === 'slug' ? req.params.slug : undefined
   const resultado = await caso.ejecutar(empresaId, datos as E)
   if (resultado === null) return reply.code(404).send({ error: 'Recurso público no disponible' })
   return resultado
  } catch (error) {
   if (error instanceof EmpresaNoPublicada) return reply.code(404).send({ error: error.message })
   req.log.error({ err: error }, 'Error en lectura pública')
   return reply.code(500).send({ error: 'No se pudo consultar la información pública' })
  }
 })
}
