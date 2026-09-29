import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import type { CasosIam } from '../../identity-access-management/infrastructure/componer-iam.js'
import { exigirOrigen, exigirSesion, type SeguridadIam } from '../../identity-access-management/presentation/seguridad-http.js'
import type { CasosCrm } from '../infrastructure/componer-crm.js'
import { erroresCrm, listaCrm, okCrm, paginaCrm, paramsCrm, suscriptorSchema } from './esquemas-crm.js'
import { suscriptorDto } from './salidas-crm.js'

type Id = { id: string }
type Pagina = { pagina?: number }

export function rutasSuscriptores(app: FastifyInstance, casos: CasosCrm, iam: CasosIam, config: SeguridadIam) {
  const base = '/api/portal/crm/suscriptores'
  const schema = { tags: ['CRM · Suscriptores'], security: [{ cookieAuth: [] }] }
  const sesion = exigirSesion(iam, config)
  const actor = (req: FastifyRequest, reply: FastifyReply) => sesion(req, reply)
  const origen = exigirOrigen(config)
  app.get<{ Querystring: Pagina }>(base, {
    schema: {
      ...schema, summary: 'Listar suscriptores', querystring: paginaCrm,
      response: { 200: listaCrm(suscriptorSchema), ...erroresCrm }
    },
  }, async (req, reply) => {
    const id = await actor(req, reply); if (!id) return reply
    const registros = await casos.suscriptores.listar.ejecutar(id, req.query.pagina ?? 1)
    await casos.registrarLectura.ejecutar(id, 'suscriptores')
    return registros.map(suscriptorDto)
  })
  app.get<{ Params: Id }>(`${base}/:id`, {
    schema: {
      ...schema, summary: 'Consultar suscriptor', params: paramsCrm,
      response: { 200: suscriptorSchema, ...erroresCrm }
    },
  }, async (req, reply) => {
    const id = await actor(req, reply); if (!id) return reply
    const registro = await casos.suscriptores.obtener.ejecutar(id, BigInt(req.params.id))
    await casos.registrarLectura.ejecutar(id, 'suscriptores', req.params.id)
    return suscriptorDto(registro)
  })
  const cambios = [
    { ruta: 'activar', ejecutar: casos.suscriptores.activar.ejecutar.bind(casos.suscriptores.activar) },
    { ruta: 'inactivar', ejecutar: casos.suscriptores.inactivar.ejecutar.bind(casos.suscriptores.inactivar) },
    { ruta: 'desuscribir', ejecutar: casos.suscriptores.desuscribir.ejecutar.bind(casos.suscriptores.desuscribir) },
  ] as const
  for (const cambio of cambios) app.patch<{ Params: Id }>(`${base}/:id/${cambio.ruta}`, {
    onRequest: origen, schema: {
      ...schema, summary: `Cambiar estado de suscriptor: ${cambio.ruta}`,
      params: paramsCrm, response: { 200: okCrm, ...erroresCrm }
    },
  }, async (req, reply) => {
    const id = await actor(req, reply); if (!id) return reply
    await cambio.ejecutar(id, BigInt(req.params.id))
    return { ok: true }
  })
}
