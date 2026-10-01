import type { FastifyInstance } from 'fastify'
import type { CasosIam } from '../../identity-access-management/infrastructure/componer-iam.js'
import { exigirOrigen, exigirSesion, type SeguridadIam } from '../../identity-access-management/presentation/seguridad-http.js'
import type { CasosCatalogo } from '../infrastructure/componer-catalogo.js'
import { errores, id, lista, ok, pagina, params, respuesta, cuerpo, orden } from './esquemas-catalogo.js'
import { crearAsignacionMarca, editarAsignacionMarca } from './esquema-asignacion-marca.js'
import { dtoAsignacionMarca } from './salidas/asignacion-marca.js'
type Id = { id: string }
type Query = { pagina?: number; productoId: string }
type Crear = { productoId: string; marcaId: string; orden: number | null }
type Editar = { orden: number | null }
export function rutasAsignacionesMarca(app: FastifyInstance, casos: CasosCatalogo, iam: CasosIam, config: SeguridadIam) {
  const base = '/api/portal/catalogo/asignaciones-marca'
  const casosRecurso = casos['asignaciones-marca']
  const sesion = exigirSesion(iam, config)
  const origen = exigirOrigen(config)
  const meta = { tags: ['Catálogo · AsignacionesMarca'], security: [{ cookieAuth: [] }] }
  app.get<{ Querystring: Query }>(base, { schema: { ...meta, querystring: cuerpo({ pagina: pagina.properties.pagina, productoId: id }, ['productoId']), response: { 200: lista, ...errores } } }, async (req, reply) => {
    const actor = await sesion(req, reply); if (!actor) return reply
    const registros = await casosRecurso.listar.ejecutar(actor, req.query.pagina ?? 1, BigInt(req.query.productoId))
    await casos.registrarLectura.ejecutar(actor, 'asignaciones-marca')
    return registros.map(dtoAsignacionMarca)
  })
  app.get<{ Params: Id }>(`${base}/:id`, { schema: { ...meta, params, response: { 200: respuesta, ...errores } } }, async (req, reply) => {
    const actor = await sesion(req, reply); if (!actor) return reply
    const registro = await casosRecurso.obtener.ejecutar(actor, BigInt(req.params.id))
    await casos.registrarLectura.ejecutar(actor, 'asignaciones-marca', req.params.id)
    return dtoAsignacionMarca(registro)
  })
  app.post<{ Body: Crear }>(base, { onRequest: origen, schema: { ...meta, body: crearAsignacionMarca, response: { 201: respuesta, ...errores } } }, async (req, reply) => {
    const actor = await sesion(req, reply); if (!actor) return reply
    const body = req.body
    const registro = await casosRecurso.crear.ejecutar(actor, { productoId: BigInt(body.productoId), marcaId: BigInt(body.marcaId), orden: body.orden })
    return reply.code(201).send(dtoAsignacionMarca(registro))
  })
  app.patch<{ Params: Id; Body: Editar }>(`${base}/:id`, { onRequest: origen, schema: { ...meta, params, body: editarAsignacionMarca, response: { 200: respuesta, ...errores } } }, async (req, reply) => {
    const actor = await sesion(req, reply); if (!actor) return reply
    return dtoAsignacionMarca(await casosRecurso.editar.ejecutar(actor, BigInt(req.params.id), req.body))
  })
  for (const accion of ['activar','inactivar','eliminar'] as const) {
    app.patch<{ Params: Id }>(`${base}/:id/${accion}`, { onRequest: origen, schema: { ...meta, params, response: { 200: ok, ...errores } } }, async (req, reply) => {
      const actor = await sesion(req, reply); if (!actor) return reply
      await casosRecurso[accion].ejecutar(actor, BigInt(req.params.id))
      return { ok: true }
    })
  }
}
