import type { FastifyInstance } from 'fastify'
import type { CasosIam } from '../../identity-access-management/infrastructure/componer-iam.js'
import { exigirOrigen, exigirSesion, type SeguridadIam } from '../../identity-access-management/presentation/seguridad-http.js'
import type { CasosCatalogo } from '../infrastructure/componer-catalogo.js'
import { errores, id, lista, ok, pagina, params, respuesta, cuerpo, orden } from './esquemas-catalogo.js'
import { crearCategoria, editarCategoria } from './esquema-categoria.js'
import { dtoCategoria } from './salidas/categoria.js'
type Id = { id: string }
type Query = { pagina?: number; productoId: string }
type Crear = { productoId: string; nombre: string; slug: string; imagen: string | null; descripcion: string | null; descripcionCorta: string | null; uso: string | null; orden: number }
type Editar = { nombre: string; imagen: string | null; descripcion: string | null; descripcionCorta: string | null; uso: string | null }
export function rutasCategorias(app: FastifyInstance, casos: CasosCatalogo, iam: CasosIam, config: SeguridadIam) {
  const base = '/api/portal/catalogo/categorias'
  const casosRecurso = casos['categorias']
  const sesion = exigirSesion(iam, config)
  const origen = exigirOrigen(config)
  const meta = { tags: ['Catálogo · Categorias'], security: [{ cookieAuth: [] }] }
  app.get<{ Querystring: Query }>(base, { schema: { ...meta, querystring: cuerpo({ pagina: pagina.properties.pagina, productoId: id }, []), response: { 200: lista, ...errores } } }, async (req, reply) => {
    const actor = await sesion(req, reply); if (!actor) return reply
    const registros = await casosRecurso.listar.ejecutar(actor, req.query.pagina ?? 1, req.query.productoId === undefined ? undefined : BigInt(req.query.productoId))
    await casos.registrarLectura.ejecutar(actor, 'categorias')
    return registros.map(dtoCategoria)
  })
  app.get<{ Params: Id }>(`${base}/:id`, { schema: { ...meta, params, response: { 200: respuesta, ...errores } } }, async (req, reply) => {
    const actor = await sesion(req, reply); if (!actor) return reply
    const registro = await casosRecurso.obtener.ejecutar(actor, BigInt(req.params.id))
    await casos.registrarLectura.ejecutar(actor, 'categorias', req.params.id)
    return dtoCategoria(registro)
  })
  app.post<{ Body: Crear }>(base, { onRequest: origen, schema: { ...meta, body: crearCategoria, response: { 201: respuesta, ...errores } } }, async (req, reply) => {
    const actor = await sesion(req, reply); if (!actor) return reply
    const body = req.body
    const registro = await casosRecurso.crear.ejecutar(actor, { productoId: BigInt(body.productoId), nombre: body.nombre, slug: body.slug, imagen: body.imagen, descripcion: body.descripcion, descripcionCorta: body.descripcionCorta, uso: body.uso, orden: body.orden })
    return reply.code(201).send(dtoCategoria(registro))
  })
  app.patch<{ Params: Id; Body: Editar }>(`${base}/:id`, { onRequest: origen, schema: { ...meta, params, body: editarCategoria, response: { 200: respuesta, ...errores } } }, async (req, reply) => {
    const actor = await sesion(req, reply); if (!actor) return reply
    return dtoCategoria(await casosRecurso.editar.ejecutar(actor, BigInt(req.params.id), req.body))
  })
  app.patch<{ Params: Id; Body: { orden: number } }>(`${base}/:id/orden`, { onRequest: origen, schema: { ...meta, params, body: cuerpo({ orden }), response: { 200: respuesta, ...errores } } }, async (req, reply) => {
    const actor = await sesion(req, reply); if (!actor) return reply
    return dtoCategoria(await casosRecurso.reordenar.ejecutar(actor, BigInt(req.params.id), req.body.orden))
  })
  for (const accion of ['activar','inactivar','eliminar'] as const) {
    app.patch<{ Params: Id }>(`${base}/:id/${accion}`, { onRequest: origen, schema: { ...meta, params, response: { 200: ok, ...errores } } }, async (req, reply) => {
      const actor = await sesion(req, reply); if (!actor) return reply
      await casosRecurso[accion].ejecutar(actor, BigInt(req.params.id))
      return { ok: true }
    })
  }
}
