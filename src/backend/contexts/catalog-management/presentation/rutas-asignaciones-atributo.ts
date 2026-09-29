import type { FastifyInstance } from 'fastify'
import type { CasosIam } from '../../identity-access-management/infrastructure/componer-iam.js'
import { exigirOrigen, exigirSesion, type SeguridadIam } from '../../identity-access-management/presentation/seguridad-http.js'
import type { CasosCatalogo } from '../infrastructure/componer-catalogo.js'
import { errores, id, lista, ok, pagina, params, respuesta, cuerpo, orden } from './esquemas-catalogo.js'
import { crearAsignacionAtributo, editarAsignacionAtributo } from './esquema-asignacion-atributo.js'
import { dtoAsignacionAtributo } from './salidas/asignacion-atributo.js'
type Id = { id: string }
type Query = { pagina?: number; categoriaId: string }
type Crear = { categoriaId: string; atributoId: string; valorPersonalizado: string | null; orden: number }
type Editar = { valorPersonalizado: string | null; orden: number }
export function rutasAsignacionesAtributo(app: FastifyInstance, casos: CasosCatalogo, iam: CasosIam, config: SeguridadIam) {
  const base = '/api/portal/catalogo/asignaciones-atributo'
  const casosRecurso = casos['asignaciones-atributo']
  const sesion = exigirSesion(iam, config)
  const origen = exigirOrigen(config)
  const meta = { tags: ['Catálogo · AsignacionesAtributo'], security: [{ cookieAuth: [] }] }
  app.get<{ Querystring: Query }>(base, { schema: { ...meta, querystring: cuerpo({ pagina: pagina.properties.pagina, categoriaId: id }, ['categoriaId']), response: { 200: lista, ...errores } } }, async (req, reply) => {
    const actor = await sesion(req, reply); if (!actor) return reply
    const registros = await casosRecurso.listar.ejecutar(actor, req.query.pagina ?? 1, BigInt(req.query.categoriaId))
    await casos.registrarLectura.ejecutar(actor, 'asignaciones-atributo')
    return registros.map(dtoAsignacionAtributo)
  })
  app.get<{ Params: Id }>(`${base}/:id`, { schema: { ...meta, params, response: { 200: respuesta, ...errores } } }, async (req, reply) => {
    const actor = await sesion(req, reply); if (!actor) return reply
    const registro = await casosRecurso.obtener.ejecutar(actor, BigInt(req.params.id))
    await casos.registrarLectura.ejecutar(actor, 'asignaciones-atributo', req.params.id)
    return dtoAsignacionAtributo(registro)
  })
  app.post<{ Body: Crear }>(base, { onRequest: origen, schema: { ...meta, body: crearAsignacionAtributo, response: { 201: respuesta, ...errores } } }, async (req, reply) => {
    const actor = await sesion(req, reply); if (!actor) return reply
    const body = req.body
    const registro = await casosRecurso.crear.ejecutar(actor, { categoriaId: BigInt(body.categoriaId), atributoId: BigInt(body.atributoId), valorPersonalizado: body.valorPersonalizado, orden: body.orden })
    return reply.code(201).send(dtoAsignacionAtributo(registro))
  })
  app.patch<{ Params: Id; Body: Editar }>(`${base}/:id`, { onRequest: origen, schema: { ...meta, params, body: editarAsignacionAtributo, response: { 200: respuesta, ...errores } } }, async (req, reply) => {
    const actor = await sesion(req, reply); if (!actor) return reply
    return dtoAsignacionAtributo(await casosRecurso.editar.ejecutar(actor, BigInt(req.params.id), req.body))
  })
  for (const accion of ['activar','inactivar','eliminar'] as const) {
    app.patch<{ Params: Id }>(`${base}/:id/${accion}`, { onRequest: origen, schema: { ...meta, params, response: { 200: ok, ...errores } } }, async (req, reply) => {
      const actor = await sesion(req, reply); if (!actor) return reply
      await casosRecurso[accion].ejecutar(actor, BigInt(req.params.id))
      return { ok: true }
    })
  }
}
