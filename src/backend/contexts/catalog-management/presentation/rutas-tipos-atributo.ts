import type { FastifyInstance } from 'fastify'
import type { CasosIam } from '../../identity-access-management/infrastructure/componer-iam.js'
import { exigirOrigen, exigirSesion, type SeguridadIam } from '../../identity-access-management/presentation/seguridad-http.js'
import type { CasosCatalogo } from '../infrastructure/componer-catalogo.js'
import { errores, id, lista, ok, pagina, params, respuesta, cuerpo, orden } from './esquemas-catalogo.js'
import { crearTipoAtributo, editarTipoAtributo } from './esquema-tipo-atributo.js'
import { dtoTipoAtributo } from './salidas/tipo-atributo.js'
type Id = { id: string }
type Query = { pagina?: number }
type Crear = { nombre: string; slug: string; descripcion: string | null; icono: string | null; capacidades: { descripcion: boolean; numero: boolean; unidad: boolean }; orden: number }
type Editar = { nombre: string; descripcion: string | null; icono: string | null; capacidades: { descripcion: boolean; numero: boolean; unidad: boolean } }
export function rutasTiposAtributo(app: FastifyInstance, casos: CasosCatalogo, iam: CasosIam, config: SeguridadIam) {
  const base = '/api/portal/catalogo/tipos-atributo'
  const casosRecurso = casos['tipos-atributo']
  const sesion = exigirSesion(iam, config)
  const origen = exigirOrigen(config)
  const meta = { tags: ['Catálogo · TiposAtributo'], security: [{ cookieAuth: [] }] }
  app.get<{ Querystring: Query }>(base, { schema: { ...meta, querystring: cuerpo({ pagina: pagina.properties.pagina }, []), response: { 200: lista, ...errores } } }, async (req, reply) => {
    const actor = await sesion(req, reply); if (!actor) return reply
    const registros = await casosRecurso.listar.ejecutar(actor, req.query.pagina ?? 1)
    await casos.registrarLectura.ejecutar(actor, 'tipos-atributo')
    return registros.map(dtoTipoAtributo)
  })
  app.get<{ Params: Id }>(`${base}/:id`, { schema: { ...meta, params, response: { 200: respuesta, ...errores } } }, async (req, reply) => {
    const actor = await sesion(req, reply); if (!actor) return reply
    const registro = await casosRecurso.obtener.ejecutar(actor, BigInt(req.params.id))
    await casos.registrarLectura.ejecutar(actor, 'tipos-atributo', req.params.id)
    return dtoTipoAtributo(registro)
  })
  app.post<{ Body: Crear }>(base, { onRequest: origen, schema: { ...meta, body: crearTipoAtributo, response: { 201: respuesta, ...errores } } }, async (req, reply) => {
    const actor = await sesion(req, reply); if (!actor) return reply
    const body = req.body
    const registro = await casosRecurso.crear.ejecutar(actor, { nombre: body.nombre, slug: body.slug, descripcion: body.descripcion, icono: body.icono, capacidades: body.capacidades, orden: body.orden })
    return reply.code(201).send(dtoTipoAtributo(registro))
  })
  app.patch<{ Params: Id; Body: Editar }>(`${base}/:id`, { onRequest: origen, schema: { ...meta, params, body: editarTipoAtributo, response: { 200: respuesta, ...errores } } }, async (req, reply) => {
    const actor = await sesion(req, reply); if (!actor) return reply
    return dtoTipoAtributo(await casosRecurso.editar.ejecutar(actor, BigInt(req.params.id), req.body))
  })
  app.patch<{ Params: Id; Body: { orden: number } }>(`${base}/:id/orden`, { onRequest: origen, schema: { ...meta, params, body: cuerpo({ orden }), response: { 200: respuesta, ...errores } } }, async (req, reply) => {
    const actor = await sesion(req, reply); if (!actor) return reply
    return dtoTipoAtributo(await casosRecurso.reordenar.ejecutar(actor, BigInt(req.params.id), req.body.orden))
  })
  for (const accion of ['activar','inactivar','eliminar'] as const) {
    app.patch<{ Params: Id }>(`${base}/:id/${accion}`, { onRequest: origen, schema: { ...meta, params, response: { 200: ok, ...errores } } }, async (req, reply) => {
      const actor = await sesion(req, reply); if (!actor) return reply
      await casosRecurso[accion].ejecutar(actor, BigInt(req.params.id))
      return { ok: true }
    })
  }
}
