import type { FastifyInstance } from 'fastify'
import type { CasosIam } from '../../identity-access-management/infrastructure/componer-iam.js'
import { exigirOrigen, exigirSesion, type SeguridadIam } from '../../identity-access-management/presentation/seguridad-http.js'
import type { CasosCatalogo } from '../infrastructure/componer-catalogo.js'
import { errores, id, lista, ok, pagina, params, respuesta, cuerpo, orden } from './esquemas-catalogo.js'
import { crearAtributoTecnico, editarAtributoTecnico } from './esquema-atributo-tecnico.js'
import { dtoAtributoTecnico } from './salidas/atributo-tecnico.js'
type Id = { id: string }
type Query = { pagina?: number; tipoAtributoId: string }
type Crear = { tipoAtributoId: string; nombre: string; valores: { descripcion: string | null; valorNumerico: string | null; unidadMedida: string | null }; orden: number }
type Editar = { nombre: string; valores: { descripcion: string | null; valorNumerico: string | null; unidadMedida: string | null } }
export function rutasAtributosTecnicos(app: FastifyInstance, casos: CasosCatalogo, iam: CasosIam, config: SeguridadIam) {
  const base = '/api/portal/catalogo/atributos-tecnicos'
  const casosRecurso = casos['atributos-tecnicos']
  const sesion = exigirSesion(iam, config)
  const origen = exigirOrigen(config)
  const meta = { tags: ['Catálogo · AtributosTecnicos'], security: [{ cookieAuth: [] }] }
  app.get<{ Querystring: Query }>(base, { schema: { ...meta, querystring: cuerpo({ pagina: pagina.properties.pagina, tipoAtributoId: id }, []), response: { 200: lista, ...errores } } }, async (req, reply) => {
    const actor = await sesion(req, reply); if (!actor) return reply
    const registros = await casosRecurso.listar.ejecutar(actor, req.query.pagina ?? 1, req.query.tipoAtributoId === undefined ? undefined : BigInt(req.query.tipoAtributoId))
    await casos.registrarLectura.ejecutar(actor, 'atributos-tecnicos')
    return registros.map(dtoAtributoTecnico)
  })
  app.get<{ Params: Id }>(`${base}/:id`, { schema: { ...meta, params, response: { 200: respuesta, ...errores } } }, async (req, reply) => {
    const actor = await sesion(req, reply); if (!actor) return reply
    const registro = await casosRecurso.obtener.ejecutar(actor, BigInt(req.params.id))
    await casos.registrarLectura.ejecutar(actor, 'atributos-tecnicos', req.params.id)
    return dtoAtributoTecnico(registro)
  })
  app.post<{ Body: Crear }>(base, { onRequest: origen, schema: { ...meta, body: crearAtributoTecnico, response: { 201: respuesta, ...errores } } }, async (req, reply) => {
    const actor = await sesion(req, reply); if (!actor) return reply
    const body = req.body
    const registro = await casosRecurso.crear.ejecutar(actor, { tipoAtributoId: BigInt(body.tipoAtributoId), nombre: body.nombre, valores: body.valores, orden: body.orden })
    return reply.code(201).send(dtoAtributoTecnico(registro))
  })
  app.patch<{ Params: Id; Body: Editar }>(`${base}/:id`, { onRequest: origen, schema: { ...meta, params, body: editarAtributoTecnico, response: { 200: respuesta, ...errores } } }, async (req, reply) => {
    const actor = await sesion(req, reply); if (!actor) return reply
    return dtoAtributoTecnico(await casosRecurso.editar.ejecutar(actor, BigInt(req.params.id), req.body))
  })
  app.patch<{ Params: Id; Body: { orden: number } }>(`${base}/:id/orden`, { onRequest: origen, schema: { ...meta, params, body: cuerpo({ orden }), response: { 200: respuesta, ...errores } } }, async (req, reply) => {
    const actor = await sesion(req, reply); if (!actor) return reply
    return dtoAtributoTecnico(await casosRecurso.reordenar.ejecutar(actor, BigInt(req.params.id), req.body.orden))
  })
  for (const accion of ['activar','inactivar','eliminar'] as const) {
    app.patch<{ Params: Id }>(`${base}/:id/${accion}`, { onRequest: origen, schema: { ...meta, params, response: { 200: ok, ...errores } } }, async (req, reply) => {
      const actor = await sesion(req, reply); if (!actor) return reply
      await casosRecurso[accion].ejecutar(actor, BigInt(req.params.id))
      return { ok: true }
    })
  }
}
