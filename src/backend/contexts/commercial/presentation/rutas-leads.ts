import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import type { CasosIam } from '../../identity-access-management/infrastructure/componer-iam.js'
import { exigirOrigen, exigirSesion, type SeguridadIam } from '../../identity-access-management/presentation/seguridad-http.js'
import type { CasosCrm } from '../infrastructure/componer-crm.js'
import { erroresCrm, listaCrm, okCrm, paramsLead, paginaCrm, leadSchema, cuerpoLead, editarResponsable } from './esquemas-crm.js'
import { leadDto } from './salidas-crm.js'

type Id = { id: string }
type Pagina = { pagina?: number }
type Cuerpo = { empresaId: string; contactoId: string | null; responsableId: string | null }

export function rutasLeads(app: FastifyInstance, casos: CasosCrm, iam: CasosIam, config: SeguridadIam) {
  const base = '/api/portal/crm/leads'
  const schema = { tags: ['CRM · Leads'], security: [{ cookieAuth: [] }] }
  const sesion = exigirSesion(iam, config)
  const actor = (req: FastifyRequest, reply: FastifyReply) => sesion(req, reply)
  const origen = exigirOrigen(config)
  app.get<{ Querystring: Pagina }>(base, {
    schema: { ...schema, summary: 'Listar leads', querystring: paginaCrm,
      response: { 200: listaCrm(leadSchema), ...erroresCrm } },
  }, async (req, reply) => {
    const id = await actor(req, reply); if (!id) return reply
    const registros = await casos.leads.listar.ejecutar(id, req.query.pagina ?? 1)
    await casos.registrarLectura.ejecutar(id, 'leads')
    return registros.map(leadDto)
  })
  app.get<{ Params: Id }>(`${base}/:id`, {
    schema: { ...schema, summary: 'Consultar lead', params: paramsLead,
      response: { 200: leadSchema, ...erroresCrm } },
  }, async (req, reply) => {
    const id = await actor(req, reply); if (!id) return reply
    const registro = await casos.leads.obtener.ejecutar(id, req.params.id)
    await casos.registrarLectura.ejecutar(id, 'leads', req.params.id)
    return leadDto(registro)
  })
  app.post<{ Body: Cuerpo }>(base, { onRequest: origen,
    schema: { ...schema, summary: 'Crear lead', body: cuerpoLead,
      response: { 201: leadSchema, ...erroresCrm } },
  }, async (req, reply) => {
    const id = await actor(req, reply); if (!id) return reply
    const registro = await casos.leads.crear.ejecutar(id, { ...req.body, empresaId: BigInt(req.body.empresaId), contactoId: req.body.contactoId === null ? null : BigInt(req.body.contactoId) })
    return reply.code(201).send(leadDto(registro))
  })
  app.patch<{ Params: Id; Body: { responsableId: string | null } }>(`${base}/:id/responsable`, {
    onRequest: origen, schema: { ...schema, summary: 'Asignar responsable del lead', params: paramsLead,
      body: editarResponsable, response: { 200: leadSchema, ...erroresCrm } },
  }, async (req, reply) => {
    const id = await actor(req, reply); if (!id) return reply
    return leadDto(await casos.leads.asignarResponsable.ejecutar(id, req.params.id, req.body.responsableId))
  })
  const cambios = [
    { ruta: 'calificar', ejecutar: casos.leads.calificar.ejecutar.bind(casos.leads.calificar) },
    { ruta: 'descartar', ejecutar: casos.leads.descartar.ejecutar.bind(casos.leads.descartar) },
    { ruta: 'eliminar', ejecutar: casos.leads.eliminar.ejecutar.bind(casos.leads.eliminar) },
  ] as const
  for (const cambio of cambios) app.patch<{ Params: Id }>(`${base}/:id/${cambio.ruta}`, {
    onRequest: origen, schema: { ...schema, summary: `Cambiar estado de lead: ${cambio.ruta}`,
      params: paramsLead, response: { 200: okCrm, ...erroresCrm } },
  }, async (req, reply) => {
    const id = await actor(req, reply); if (!id) return reply
    await cambio.ejecutar(id, req.params.id)
    return { ok: true }
  })
}
