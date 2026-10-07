import type { FastifyInstance } from 'fastify'
import type { CasosCms } from '../infrastructure/componer-cms.js'
import * as S from './esquemas-cms.js'
import { crearContenidoRegistroSchema, editarContenidoRegistroSchema, salidaContenidoRegistroSchema } from './esquemas-contenido-registro.js'
import { salidaContenidoRegistro } from './salidas-contenido-registro.js'
import { contextoHttpCms, cuerpoHttpCms, entradaHttpCms, consultaHttpCms, leerHttpCms, versionHttpCms, idHttpCms } from './http-cms.js'
type DatosCrear = Parameters<CasosCms['contenidos-registro']['crear']['ejecutar']>[1]
type DatosEditar = Parameters<CasosCms['contenidos-registro']['editar']['ejecutar']>[3]
type Consulta = Parameters<CasosCms['contenidos-registro']['listar']['ejecutar']>[1]

export function rutasContenidosRegistro(app: FastifyInstance, casos: CasosCms): void {
  const base = '/api/portal/cms/contenidos-registro'
  const recurso = casos['contenidos-registro']
  const comun = { tags: ['CMS · ContenidosRegistro'], security: [{ cookieAuth: [] }] }
  app.get(base, { schema: { ...comun, summary: 'Listar ContenidosRegistro', querystring: S.querySchemaCms(["empresaId", "registroId"], false), response: { 200: { type: 'array', items: salidaContenidoRegistroSchema }, ...S.erroresSchemaCms } } }, async req => {
    const ctx = contextoHttpCms(req)
    return leerHttpCms(casos, req, 'contenidos_registro', async () => (await recurso.listar.ejecutar(ctx.actorId, consultaHttpCms<Consulta>(req.query, ["empresaId", "registroId"]))).map(salidaContenidoRegistro))
  })
  app.get<{ Params: { id: string } }>(`${base}/:id`, { schema: { ...comun, summary: 'Consultar ContenidoRegistro', params: S.paramsSchemaCms, response: { 200: salidaContenidoRegistroSchema, ...S.erroresSchemaCms } } }, async req => {
    const ctx = contextoHttpCms(req), id = idHttpCms(req.params.id)
    return leerHttpCms(casos, req, 'contenidos_registro', async () => salidaContenidoRegistro(await recurso.obtener.ejecutar(ctx.actorId, id)), req.params.id)
  })
  app.post(base, { schema: { ...comun, summary: 'Crear ContenidoRegistro', body: crearContenidoRegistroSchema, response: { 201: salidaContenidoRegistroSchema, ...S.erroresSchemaCms } } }, async (req, reply) => {
    const entrada = entradaHttpCms<DatosCrear>(cuerpoHttpCms(req), ["empresaId", "registroId"])
    const registro = await recurso.crear.ejecutar(contextoHttpCms(req), entrada)
    return reply.code(201).send(salidaContenidoRegistro(registro))
  })
  app.patch<{ Params: { id: string } }>(`${base}/:id`, { schema: { ...comun, summary: 'Editar ContenidoRegistro', params: S.paramsSchemaCms, body: editarContenidoRegistroSchema, response: { 200: salidaContenidoRegistroSchema, ...S.erroresSchemaCms } } }, async req => {
    const body = cuerpoHttpCms(req), version = versionHttpCms(body.version)
    return salidaContenidoRegistro(await recurso.editar.ejecutar(contextoHttpCms(req), idHttpCms(req.params.id), version, entradaHttpCms<DatosEditar>(body, [])))
  })
  app.patch<{ Params: { id: string } }>(`${base}/:id/activar`, { schema: { ...comun, summary: 'activar ContenidoRegistro', params: S.paramsSchemaCms, body: S.objetoCms({ version: S.versionSchemaCms }), response: { 200: salidaContenidoRegistroSchema, ...S.erroresSchemaCms } } }, async req => {
    const body = cuerpoHttpCms(req), version = versionHttpCms(body.version)
    return salidaContenidoRegistro(await recurso.activar.ejecutar(contextoHttpCms(req), idHttpCms(req.params.id), version))
  })
  app.patch<{ Params: { id: string } }>(`${base}/:id/eliminar`, { schema: { ...comun, summary: 'eliminar ContenidoRegistro', params: S.paramsSchemaCms, body: S.objetoCms({ version: S.versionSchemaCms }), response: { 200: salidaContenidoRegistroSchema, ...S.erroresSchemaCms } } }, async req => {
    const body = cuerpoHttpCms(req), version = versionHttpCms(body.version)
    return salidaContenidoRegistro(await recurso.eliminar.ejecutar(contextoHttpCms(req), idHttpCms(req.params.id), version))
  })
  app.patch<{ Params: { id: string } }>(`${base}/:id/inactivar`, { schema: { ...comun, summary: 'inactivar ContenidoRegistro', params: S.paramsSchemaCms, body: S.objetoCms({ version: S.versionSchemaCms }), response: { 200: salidaContenidoRegistroSchema, ...S.erroresSchemaCms } } }, async req => {
    const body = cuerpoHttpCms(req), version = versionHttpCms(body.version)
    return salidaContenidoRegistro(await recurso.inactivar.ejecutar(contextoHttpCms(req), idHttpCms(req.params.id), version))
  })
  app.patch<{ Params: { id: string } }>(`${base}/:id/reordenar`, { schema: { ...comun, summary: 'reordenar ContenidoRegistro', params: S.paramsSchemaCms, body: S.objetoCms({ version: S.versionSchemaCms, orden: S.ordenSchemaCms }), response: { 200: salidaContenidoRegistroSchema, ...S.erroresSchemaCms } } }, async req => {
    const body = cuerpoHttpCms(req), version = versionHttpCms(body.version)
    return salidaContenidoRegistro(await recurso.reordenar.ejecutar(contextoHttpCms(req), idHttpCms(req.params.id), version, body.orden as number))
  })
}
