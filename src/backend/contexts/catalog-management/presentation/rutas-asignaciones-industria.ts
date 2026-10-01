import type { FastifyInstance } from 'fastify'
import type { CasosIam } from '../../identity-access-management/infrastructure/componer-iam.js'
import { exigirOrigen, exigirSesion, type SeguridadIam } from '../../identity-access-management/presentation/seguridad-http.js'
import type { CasosCatalogo } from '../infrastructure/componer-catalogo.js'
import { errores, id, lista, ok, pagina, params, respuesta, cuerpo, orden } from './esquemas-catalogo.js'
import { crearAsignacionIndustria, editarAsignacionIndustria } from './esquema-asignacion-industria.js'
import { dtoAsignacionIndustria } from './salidas/asignacion-industria.js'
type Id = { id: string }
type Query = { pagina?: number; industriaId: string }
type Crear = { industriaId: string; destino: { tipo: "categoria" | "servicio"; id: string }; orden: number }
type Editar = { orden: number }
export function rutasAsignacionesIndustria(app: FastifyInstance, casos: CasosCatalogo, iam: CasosIam, config: SeguridadIam) {
  const base = '/api/portal/catalogo/asignaciones-industria'
  const casosRecurso = casos['asignaciones-industria']
  const sesion = exigirSesion(iam, config)
  const origen = exigirOrigen(config)
  const meta = { tags: ['Catálogo · AsignacionesIndustria'], security: [{ cookieAuth: [] }] }
  app.get<{ Querystring: Query }>(base, { schema: { ...meta, querystring: cuerpo({ pagina: pagina.properties.pagina, industriaId: id }, ['industriaId']), response: { 200: lista, ...errores } } }, async (req, reply) => {
    const actor = await sesion(req, reply); if (!actor) return reply
    const registros = await casosRecurso.listar.ejecutar(actor, req.query.pagina ?? 1, BigInt(req.query.industriaId))
    await casos.registrarLectura.ejecutar(actor, 'asignaciones-industria')
    return registros.map(dtoAsignacionIndustria)
  })
  app.get<{ Params: Id }>(`${base}/:id`, { schema: { ...meta, params, response: { 200: respuesta, ...errores } } }, async (req, reply) => {
    const actor = await sesion(req, reply); if (!actor) return reply
    const registro = await casosRecurso.obtener.ejecutar(actor, BigInt(req.params.id))
    await casos.registrarLectura.ejecutar(actor, 'asignaciones-industria', req.params.id)
    return dtoAsignacionIndustria(registro)
  })
  app.post<{ Body: Crear }>(base, { onRequest: origen, schema: { ...meta, body: crearAsignacionIndustria, response: { 201: respuesta, ...errores } } }, async (req, reply) => {
    const actor = await sesion(req, reply); if (!actor) return reply
    const body = req.body
    const registro = await casosRecurso.crear.ejecutar(actor, { industriaId: BigInt(body.industriaId), destino:  { tipo: body.destino.tipo, id: BigInt(body.destino.id) }, orden: body.orden })
    return reply.code(201).send(dtoAsignacionIndustria(registro))
  })
  app.patch<{ Params: Id; Body: Editar }>(`${base}/:id`, { onRequest: origen, schema: { ...meta, params, body: editarAsignacionIndustria, response: { 200: respuesta, ...errores } } }, async (req, reply) => {
    const actor = await sesion(req, reply); if (!actor) return reply
    return dtoAsignacionIndustria(await casosRecurso.editar.ejecutar(actor, BigInt(req.params.id), req.body))
  })
  for (const accion of ['activar','inactivar','eliminar'] as const) {
    app.patch<{ Params: Id }>(`${base}/:id/${accion}`, { onRequest: origen, schema: { ...meta, params, response: { 200: ok, ...errores } } }, async (req, reply) => {
      const actor = await sesion(req, reply); if (!actor) return reply
      await casosRecurso[accion].ejecutar(actor, BigInt(req.params.id))
      return { ok: true }
    })
  }
}
