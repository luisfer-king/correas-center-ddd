import type { FastifyInstance } from 'fastify'
import type { CasosIam } from '../../identity-access-management/infrastructure/componer-iam.js'
import { exigirOrigen, exigirSesion, type SeguridadIam } from '../../identity-access-management/presentation/seguridad-http.js'
import type { CasosCatalogo } from '../infrastructure/componer-catalogo.js'
import { errores, id, lista, ok, pagina, params, respuesta, cuerpo, orden } from './esquemas-catalogo.js'
import { crearIndustria, editarIndustria } from './esquema-industria.js'
import { dtoIndustria } from './salidas/industria.js'
type Id = { id: string }
type Query = { pagina?: number; empresaId: string }
type Crear = { empresaId: string; nombre: string; slug: string; imagen: string | null; orden: number }
type Editar = { nombre: string; imagen: string | null }
export function rutasIndustrias(app: FastifyInstance, casos: CasosCatalogo, iam: CasosIam, config: SeguridadIam) {
  const base = '/api/portal/catalogo/industrias'
  const casosRecurso = casos['industrias']
  const sesion = exigirSesion(iam, config)
  const origen = exigirOrigen(config)
  const meta = { tags: ['Catálogo · Industrias'], security: [{ cookieAuth: [] }] }
  app.get<{ Querystring: Query }>(base, { schema: { ...meta, querystring: cuerpo({ pagina: pagina.properties.pagina, empresaId: id }, []), response: { 200: lista, ...errores } } }, async (req, reply) => {
    const actor = await sesion(req, reply); if (!actor) return reply
    const registros = await casosRecurso.listar.ejecutar(actor, req.query.pagina ?? 1, req.query.empresaId === undefined ? undefined : BigInt(req.query.empresaId))
    await casos.registrarLectura.ejecutar(actor, 'industrias')
    return registros.map(dtoIndustria)
  })
  app.get<{ Params: Id }>(`${base}/:id`, { schema: { ...meta, params, response: { 200: respuesta, ...errores } } }, async (req, reply) => {
    const actor = await sesion(req, reply); if (!actor) return reply
    const registro = await casosRecurso.obtener.ejecutar(actor, BigInt(req.params.id))
    await casos.registrarLectura.ejecutar(actor, 'industrias', req.params.id)
    return dtoIndustria(registro)
  })
  app.post<{ Body: Crear }>(base, { onRequest: origen, schema: { ...meta, body: crearIndustria, response: { 201: respuesta, ...errores } } }, async (req, reply) => {
    const actor = await sesion(req, reply); if (!actor) return reply
    const body = req.body
    const registro = await casosRecurso.crear.ejecutar(actor, { empresaId: BigInt(body.empresaId), nombre: body.nombre, slug: body.slug, imagen: body.imagen, orden: body.orden })
    return reply.code(201).send(dtoIndustria(registro))
  })
  app.patch<{ Params: Id; Body: Editar }>(`${base}/:id`, { onRequest: origen, schema: { ...meta, params, body: editarIndustria, response: { 200: respuesta, ...errores } } }, async (req, reply) => {
    const actor = await sesion(req, reply); if (!actor) return reply
    return dtoIndustria(await casosRecurso.editar.ejecutar(actor, BigInt(req.params.id), req.body))
  })
  app.patch<{ Params: Id; Body: { orden: number } }>(`${base}/:id/orden`, { onRequest: origen, schema: { ...meta, params, body: cuerpo({ orden }), response: { 200: respuesta, ...errores } } }, async (req, reply) => {
    const actor = await sesion(req, reply); if (!actor) return reply
    return dtoIndustria(await casosRecurso.reordenar.ejecutar(actor, BigInt(req.params.id), req.body.orden))
  })
  for (const accion of ['activar','inactivar','eliminar'] as const) {
    app.patch<{ Params: Id }>(`${base}/:id/${accion}`, { onRequest: origen, schema: { ...meta, params, response: { 200: ok, ...errores } } }, async (req, reply) => {
      const actor = await sesion(req, reply); if (!actor) return reply
      await casosRecurso[accion].ejecutar(actor, BigInt(req.params.id))
      return { ok: true }
    })
  }
}
