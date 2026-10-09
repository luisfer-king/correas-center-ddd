import type {} from '@fastify/swagger'
import type { FastifyInstance } from 'fastify'
import type { ObtenerVistaPublica } from '../application/use-cases/publico/obtener-vista-publica.js'
export function registrarRutasPublicasCms(app: FastifyInstance, caso: ObtenerVistaPublica, empresaId: bigint) {
 app.get('/api/publico/vista', { schema: { tags: ['CMS público'], summary: 'Navegación y secciones publicadas de la empresa configurada' } }, async (_req, reply) => {
  const vista = await caso.ejecutar(empresaId)
  reply.header('Cache-Control', 'no-store')
  if (!vista) return reply.code(404).send({ mensaje: 'Empresa pública no disponible' })
  return vista
 })
}
