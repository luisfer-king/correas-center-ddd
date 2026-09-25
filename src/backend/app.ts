import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import Fastify from 'fastify'

export async function createApp() {
  const app = Fastify({ logger: true, trustProxy: false })
  await app.register(swagger, {
    openapi: {
      openapi: '3.0.3',
      info: { title: 'Correas Center API', version: '0.1.0' },
    },
  })
  await app.register(swaggerUi, { routePrefix: '/api/docs' })
  app.get('/api/health', {
    schema: {
      tags: ['Sistema'],
      summary: 'Comprueba que la API está activa',
      response: {
        200: {
          type: 'object',
          required: ['status'],
          properties: { status: { type: 'string', enum: ['ok'] } },
        },
      },
    },
  }, async () => ({ status: 'ok' }))
  return app
}
