import type { FastifyInstance } from 'fastify'
export function registrarErroresCms(app: FastifyInstance): void {
  app.setErrorHandler((error, req, reply) => {
    const e = error as Error & { validation?: unknown; statusCode?: number; code?: string }
    if (e.message === 'Fuente o filtro del wizard no permitido') return reply.code(400).send({ error: 'La fuente de datos o el filtro seleccionado no está habilitado para el wizard' })
    if (e.validation || e.statusCode === 400 || e.code === 'FST_ERR_CTP_INVALID_JSON_BODY') return reply.code(400).send({ error: 'Solicitud inválida' })
    if (e.statusCode === 413) return reply.code(413).send({ error: 'Solicitud demasiado grande' })
    if (e.statusCode === 415) return reply.code(415).send({ error: 'Tipo de contenido no admitido' })
    if (e.statusCode === 429) return reply.code(429).send({ error: 'Demasiadas solicitudes' })
    if (e.message === 'Sesión inválida') return reply.code(401).send({ error: e.message })
    if (e.message.startsWith('Acceso denegado')) return reply.code(403).send({ error: 'Acceso denegado' })
    if (/modificad[oa]|debe avanzar|con contenidos activos|con ítems activos|Campo inmutable|mediante su repositorio|Registro no activo|Registro no inactivo|Registro eliminado/.test(e.message) || ['P2002','P2003','P2034'].includes(e.code ?? '')) return reply.code(409).send({ error: 'Operación en conflicto; vuelve a cargar los datos' })
    if (/no disponible|otra empresa|otra sección/.test(e.message)) return reply.code(404).send({ error: 'Registro no disponible' })
    if (/inválid|obligatori|no permitido|no corresponde|sin enlace|no declaradas|duplicadas|Metadata|metadata|inconsistente|retrocede/.test(e.message)) return reply.code(400).send({ error: 'Solicitud inválida' })
    req.log.error({ err: error }, 'Fallo CMS')
    return reply.code(500).send({ error: 'Error interno' })
  })
}
