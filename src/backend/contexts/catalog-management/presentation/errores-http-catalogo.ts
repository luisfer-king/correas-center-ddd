import type { FastifyInstance } from 'fastify'
export function registrarErroresCatalogo(app: FastifyInstance) {
  app.setErrorHandler((error, request, reply) => {
    const fallo = error as Error & { validation?: unknown; code?: string; statusCode?: number }
    if (fallo.validation || fallo.statusCode === 400 || /^(Slug|Orden|ID|Página|Decimal|Fecha|Número|Nombre|Tipo|Capacidades|Versión).*inválid/.test(fallo.message) || /(obligatorio|incompatible)$/.test(fallo.message)) return reply.code(400).send({ error: 'Solicitud inválida' })
    if (fallo.message === 'Sesión inválida') return reply.code(401).send({ error: fallo.message })
    if (fallo.message === 'Acceso denegado') return reply.code(403).send({ error: fallo.message })
    if (fallo.message === 'Registro no disponible' || fallo.message === 'Asignación no disponible') return reply.code(404).send({ error: fallo.message })
    if (['P2002','P2003','P2034'].includes(fallo.code ?? '') || /(?:modificad[oa] por otra operación|ya registrada|Registro eliminado|Relación eliminada|no está activo|no está inactivo|no activa|no inactiva|Referencia no disponible|misma empresa)/.test(fallo.message)) return reply.code(409).send({ error: 'Operación incompatible con el estado actual' })
    request.log.error({ err: error }, 'Fallo Catálogo')
    return reply.code(500).send({ error: 'Error interno' })
  })
}
