import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { interpretarMapaSucursal } from '../../../../shared/mapa-sucursal.js'
import type { CasosIam } from '../../identity-access-management/infrastructure/componer-iam.js'
import { exigirOrigen, exigirSesion, type SeguridadIam } from '../../identity-access-management/presentation/seguridad-http.js'
import type { CasosCrm } from '../infrastructure/componer-crm.js'
import { cuerpoSucursal, editarSucursal, erroresCrm, listaCrm, okCrm, paginaCrm, paramsCrm, sucursalSchema } from './esquemas-crm.js'
import { sucursalDto } from './salidas-crm.js'

type Id = { id: string }
type Pagina = { pagina?: number }
type Cuerpo = { empresaId: string; nombre: string; direccion: string; telefono: string; email: string | null; horarios: string | null; mapaIncrustado: string | null; latitud: string | null; longitud: string | null; orden: number; ordenAutomatico?: boolean; esPrincipal: boolean }

export function rutasSucursales(app: FastifyInstance, casos: CasosCrm, iam: CasosIam, config: SeguridadIam) {
  const base = '/api/portal/crm/sucursales'
  const schema = { tags: ['CRM · Sucursales'], security: [{ cookieAuth: [] }] }
  const sesion = exigirSesion(iam, config)
  const actor = (req: FastifyRequest, reply: FastifyReply) => sesion(req, reply)
  const origen = exigirOrigen(config)
  app.get<{ Querystring: Pagina }>(base, {
    schema: {
      ...schema, summary: 'Listar sucursales', querystring: paginaCrm,
      response: { 200: listaCrm(sucursalSchema), ...erroresCrm }
    },
  }, async (req, reply) => {
    const id = await actor(req, reply); if (!id) return reply
    const registros = await casos.sucursales.listar.ejecutar(id, req.query.pagina ?? 1)
    await casos.registrarLectura.ejecutar(id, 'sucursales')
    return registros.map(sucursalDto)
  })
  app.get<{ Params: Id }>(`${base}/:id`, {
    schema: {
      ...schema, summary: 'Consultar sucursal', params: paramsCrm,
      response: { 200: sucursalSchema, ...erroresCrm }
    },
  }, async (req, reply) => {
    const id = await actor(req, reply); if (!id) return reply
    const registro = await casos.sucursales.obtener.ejecutar(id, BigInt(req.params.id))
    await casos.registrarLectura.ejecutar(id, 'sucursales', req.params.id)
    return sucursalDto(registro)
  })
  app.post<{ Body: Cuerpo }>(base, {
    onRequest: origen,
    schema: {
      ...schema, summary: 'Crear sucursal', body: cuerpoSucursal,
      response: { 201: sucursalSchema, ...erroresCrm }
    },
  }, async (req, reply) => {
    const id = await actor(req, reply); if (!id) return reply
    try { interpretarMapaSucursal(req.body.mapaIncrustado) } catch (error) { return reply.code(400).send({ error: (error as Error).message }) }
    const registro = await casos.sucursales.crear.ejecutar(id, { ...req.body, empresaId: BigInt(req.body.empresaId) })
    return reply.code(201).send(sucursalDto(registro))
  })
  app.patch<{ Params: Id; Body: { nombre: string; direccion: string; telefono: string; email: string | null; horarios: string | null; mapaIncrustado: string | null; latitud: string | null; longitud: string | null; orden: number; esPrincipal: boolean } }>(`${base}/:id`, {
    onRequest: origen,
    schema: {
      ...schema, summary: 'Editar sucursal', params: paramsCrm, body: editarSucursal,
      response: { 200: sucursalSchema, ...erroresCrm }
    },
  }, async (req, reply) => {
    const id = await actor(req, reply); if (!id) return reply
    try { interpretarMapaSucursal(req.body.mapaIncrustado) } catch (error) { return reply.code(400).send({ error: (error as Error).message }) }
    return sucursalDto(await casos.sucursales.editar.ejecutar(id, BigInt(req.params.id), req.body))
  })
  const cambios = [
    { ruta: 'activar', ejecutar: casos.sucursales.activar.ejecutar.bind(casos.sucursales.activar) },
    { ruta: 'inactivar', ejecutar: casos.sucursales.inactivar.ejecutar.bind(casos.sucursales.inactivar) },
    { ruta: 'eliminar', ejecutar: casos.sucursales.eliminar.ejecutar.bind(casos.sucursales.eliminar) },
  ] as const
  for (const cambio of cambios) app.patch<{ Params: Id }>(`${base}/:id/${cambio.ruta}`, {
    onRequest: origen, schema: {
      ...schema, summary: `Cambiar estado de sucursal: ${cambio.ruta}`,
      params: paramsCrm, response: { 200: okCrm, ...erroresCrm }
    },
  }, async (req, reply) => {
    const id = await actor(req, reply); if (!id) return reply
    await cambio.ejecutar(id, BigInt(req.params.id))
    return { ok: true }
  })
}
