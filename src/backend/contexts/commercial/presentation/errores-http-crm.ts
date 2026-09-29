import type { FastifyInstance } from 'fastify'

export function registrarErroresCrm(app: FastifyInstance) {
  app.setErrorHandler((error, request, reply) => {
    const fallo = error as Error & { validation?: unknown; code?: string; statusCode?: number }
    if (fallo.validation) return reply.code(400).send({ error: 'Solicitud inválida' })
    if (fallo.statusCode === 429) return reply.code(429).send({ error: 'Demasiadas solicitudes' })
    const mensaje = fallo.message
    if (mensaje === 'Sesión inválida') return reply.code(401).send({ error: mensaje })
    if (mensaje === 'Acceso denegado') return reply.code(403).send({ error: mensaje })
    if (/^(Empresa|Sucursal|Contacto|Suscriptor|Lead) no disponible$/.test(mensaje)) {
      return reply.code(404).send({ error: mensaje })
    }
    if (['Email inválido','UUID inválido','UUID de Lead inválido','ID bigint positivo requerido',
      'Coordenada decimal inválida','Coordenada fuera de rango','Orden inválido',
      'Fecha inválida','Página inválida'].includes(mensaje) ||
      /(obligatorio|demasiado largo)$/.test(mensaje)) return reply.code(400).send({ error: 'Solicitud inválida' })
    if (fallo.code === 'P2002' || fallo.code === 'P2003' || fallo.code === 'P2034' ||
      /modificad[oa] por otra operación/.test(mensaje) ||
      ['Email ya registrado','El contacto ya tiene un lead','Sucursal no activa',
        'Registro eliminado','Contacto eliminado','Suscriptor eliminado','Lead eliminado',
        'Contacto ya archivado','Suscriptor desuscrito','Lead no disponible para calificar',
        'Lead no disponible para descartar','Registro no activo','Registro no inactivo',
        'Solo puede responderse un contacto nuevo','Solo se puede activar un suscriptor inactivo',
        'Solo se puede inactivar un suscriptor activo'].includes(mensaje)) {
      return reply.code(409).send({ error: 'Operación incompatible con el estado actual' })
    }
    request.log.error({ err: error }, 'Fallo CRM')
    return reply.code(500).send({ error: 'Error interno' })
  })
}
