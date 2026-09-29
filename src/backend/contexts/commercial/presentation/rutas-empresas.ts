import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import type { CasosIam } from '../../identity-access-management/infrastructure/componer-iam.js'
import { exigirOrigen, exigirSesion, type SeguridadIam } from '../../identity-access-management/presentation/seguridad-http.js'
import type { CasosCrm } from '../infrastructure/componer-crm.js'
import { cuerpoEmpresa, empresaSchema, erroresCrm, listaCrm, okCrm, paginaCrm, paramsCrm } from './esquemas-crm.js'
import { rutasLogoEmpresa } from './rutas-logo-empresa.js'
import { empresaDto } from './salidas-crm.js'

type Id = { id: string }
type Pagina = { pagina?: number }
type Cuerpo = { nombre: string; logo: string | null }

export function rutasEmpresas(app: FastifyInstance, casos: CasosCrm, iam: CasosIam, config: SeguridadIam) {
  rutasLogoEmpresa(app, casos, iam, config)
  const base = '/api/portal/crm/empresas'
  const schema = { tags: ['CRM · Empresas'], security: [{ cookieAuth: [] }] }
  const sesion = exigirSesion(iam, config)
  const actor = (req: FastifyRequest, reply: FastifyReply) => sesion(req, reply)
  const origen = exigirOrigen(config)
  app.get<{ Querystring: Pagina }>(base, {
    schema: {
      ...schema, summary: 'Listar empresas', querystring: paginaCrm,
      response: { 200: listaCrm(empresaSchema), ...erroresCrm }
    },
  }, async (req, reply) => {
    const id = await actor(req, reply); if (!id) return reply
    const registros = await casos.empresas.listar.ejecutar(id, req.query.pagina ?? 1)
    await casos.registrarLectura.ejecutar(id, 'empresas')
    return registros.map(empresaDto)
  })
  app.get<{ Params: Id }>(`${base}/:id`, {
    schema: {
      ...schema, summary: 'Consultar empresa', params: paramsCrm,
      response: { 200: empresaSchema, ...erroresCrm }
    },
  }, async (req, reply) => {
    const id = await actor(req, reply); if (!id) return reply
    const registro = await casos.empresas.obtener.ejecutar(id, BigInt(req.params.id))
    await casos.registrarLectura.ejecutar(id, 'empresas', req.params.id)
    return empresaDto(registro)
  })
  app.post<{ Body: Cuerpo }>(base, {
    onRequest: origen,
    schema: {
      ...schema, summary: 'Crear empresa', body: cuerpoEmpresa,
      response: { 201: empresaSchema, ...erroresCrm }
    },
  }, async (req, reply) => {
    const id = await actor(req, reply); if (!id) return reply
    const registro = await casos.empresas.crear.ejecutar(id, req.body)
    return reply.code(201).send(empresaDto(registro))
  })
  app.patch<{ Params: Id; Body: { nombre: string; logo: string | null } }>(`${base}/:id`, {
    onRequest: origen,
    schema: {
      ...schema, summary: 'Editar empresa', params: paramsCrm, body: cuerpoEmpresa,
      response: { 200: empresaSchema, ...erroresCrm }
    },
  }, async (req, reply) => {
    const id = await actor(req, reply); if (!id) return reply
    return empresaDto(await casos.empresas.editar.ejecutar(id, BigInt(req.params.id), req.body))
  })
  const cambios = [
    { ruta: 'activar', ejecutar: casos.empresas.activar.ejecutar.bind(casos.empresas.activar) },
    { ruta: 'inactivar', ejecutar: casos.empresas.inactivar.ejecutar.bind(casos.empresas.inactivar) },
    { ruta: 'eliminar', ejecutar: casos.empresas.eliminar.ejecutar.bind(casos.empresas.eliminar) },
  ] as const
  for (const cambio of cambios) app.patch<{ Params: Id }>(`${base}/:id/${cambio.ruta}`, {
    onRequest: origen, schema: {
      ...schema, summary: `Cambiar estado de empresa: ${cambio.ruta}`,
      params: paramsCrm, response: { 200: okCrm, ...erroresCrm }
    },
  }, async (req, reply) => {
    const id = await actor(req, reply); if (!id) return reply
    await cambio.ejecutar(id, BigInt(req.params.id))
    return { ok: true }
  })
}
