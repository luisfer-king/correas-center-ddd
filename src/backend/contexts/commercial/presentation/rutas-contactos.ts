import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import type { CasosIam } from '../../identity-access-management/infrastructure/componer-iam.js'
import { exigirOrigen, exigirSesion, type SeguridadIam } from '../../identity-access-management/presentation/seguridad-http.js'
import type { CasosCrm } from '../infrastructure/componer-crm.js'
import { erroresCrm, listaCrm, okCrm, paramsCrm, paginaCrm, contactoSchema, cuerpoContacto } from './esquemas-crm.js'
import { contactoDto } from './salidas-crm.js'

type Id = { id: string }
type Pagina = { pagina?: number }
type Cuerpo = { empresaId: string; nombre: string; empresaDeclarada: string | null; telefono: string; email: string; mensaje: string }

export function rutasContactos(app: FastifyInstance, casos: CasosCrm, iam: CasosIam, config: SeguridadIam) {
  const base = '/api/portal/crm/contactos'
  const schema = { tags: ['CRM · Contactos'], security: [{ cookieAuth: [] }] }
  const sesion = exigirSesion(iam, config)
  const actor = (req: FastifyRequest, reply: FastifyReply) => sesion(req, reply)
  const origen = exigirOrigen(config)
  app.get<{ Querystring: Pagina }>(base, {
    schema: { ...schema, summary: 'Listar contactos', querystring: paginaCrm,
      response: { 200: listaCrm(contactoSchema), ...erroresCrm } },
  }, async (req, reply) => {
    const id = await actor(req, reply); if (!id) return reply
    const registros = await casos.contactos.listar.ejecutar(id, req.query.pagina ?? 1)
    await casos.registrarLectura.ejecutar(id, 'contactos')
    return registros.map(contactoDto)
  })
  app.get<{ Params: Id }>(`${base}/:id`, {
    schema: { ...schema, summary: 'Consultar contacto', params: paramsCrm,
      response: { 200: contactoSchema, ...erroresCrm } },
  }, async (req, reply) => {
    const id = await actor(req, reply); if (!id) return reply
    const registro = await casos.contactos.obtener.ejecutar(id, BigInt(req.params.id))
    await casos.registrarLectura.ejecutar(id, 'contactos', req.params.id)
    return contactoDto(registro)
  })
  app.post<{ Body: Cuerpo }>(base, { onRequest: origen,
    schema: { ...schema, summary: 'Crear contacto', body: cuerpoContacto,
      response: { 201: contactoSchema, ...erroresCrm } },
  }, async (req, reply) => {
    const id = await actor(req, reply); if (!id) return reply
    const registro = await casos.contactos.crear.ejecutar(id, { ...req.body, empresaId: BigInt(req.body.empresaId) })
    return reply.code(201).send(contactoDto(registro))
  })
  const cambios = [
    { ruta: 'respondido', ejecutar: casos.contactos.respondido.ejecutar.bind(casos.contactos.respondido) },
    { ruta: 'archivar', ejecutar: casos.contactos.archivar.ejecutar.bind(casos.contactos.archivar) },
    { ruta: 'eliminar', ejecutar: casos.contactos.eliminar.ejecutar.bind(casos.contactos.eliminar) },
  ] as const
  for (const cambio of cambios) app.patch<{ Params: Id }>(`${base}/:id/${cambio.ruta}`, {
    onRequest: origen, schema: { ...schema, summary: `Cambiar estado de contacto: ${cambio.ruta}`,
      params: paramsCrm, response: { 200: okCrm, ...erroresCrm } },
  }, async (req, reply) => {
    const id = await actor(req, reply); if (!id) return reply
    await cambio.ejecutar(id, BigInt(req.params.id))
    return { ok: true }
  })
}
