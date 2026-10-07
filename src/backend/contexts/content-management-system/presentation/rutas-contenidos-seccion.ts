import type { FastifyInstance } from 'fastify'
import type { CasosCms } from '../infrastructure/componer-cms.js'
import * as S from './esquemas-cms.js'
import { crearContenidoSeccionSchema, editarContenidoSeccionSchema, salidaContenidoSeccionSchema } from './esquemas-contenido-seccion.js'
import { salidaContenidoSeccion } from './salidas-contenido-seccion.js'
import { contextoHttpCms, cuerpoHttpCms, entradaHttpCms, consultaHttpCms, leerHttpCms, versionHttpCms, idHttpCms } from './http-cms.js'
type DatosCrear = Parameters<CasosCms['contenidos-seccion']['crear']['ejecutar']>[1]
type DatosEditar = Parameters<CasosCms['contenidos-seccion']['editar']['ejecutar']>[3]
type Consulta = Parameters<CasosCms['contenidos-seccion']['listar']['ejecutar']>[1]

export function rutasContenidosSeccion(app: FastifyInstance, casos: CasosCms): void {
  const base = '/api/portal/cms/contenidos-seccion'
  const recurso = casos['contenidos-seccion']
  const comun = { tags: ['CMS · ContenidosSeccion'], security: [{ cookieAuth: [] }] }
  app.get(base, { schema: { ...comun, summary: 'Listar ContenidosSeccion', querystring: S.querySchemaCms(["empresaId", "tipoSeccionId"], false), response: { 200: { type: 'array', items: salidaContenidoSeccionSchema }, ...S.erroresSchemaCms } } }, async req => {
    const ctx = contextoHttpCms(req)
    return leerHttpCms(casos, req, 'contenidos_seccion', async () => (await recurso.listar.ejecutar(ctx.actorId, consultaHttpCms<Consulta>(req.query, ["empresaId", "tipoSeccionId"]))).map(salidaContenidoSeccion))
  })
  app.get<{ Params: { id: string } }>(`${base}/:id`, { schema: { ...comun, summary: 'Consultar ContenidoSeccion', params: S.paramsSchemaCms, response: { 200: salidaContenidoSeccionSchema, ...S.erroresSchemaCms } } }, async req => {
    const ctx = contextoHttpCms(req), id = idHttpCms(req.params.id)
    return leerHttpCms(casos, req, 'contenidos_seccion', async () => salidaContenidoSeccion(await recurso.obtener.ejecutar(ctx.actorId, id)), req.params.id)
  })
  app.post(base, { schema: { ...comun, summary: 'Crear ContenidoSeccion', body: crearContenidoSeccionSchema, response: { 201: salidaContenidoSeccionSchema, ...S.erroresSchemaCms } } }, async (req, reply) => {
    const entrada = entradaHttpCms<DatosCrear>(cuerpoHttpCms(req), ["empresaId", "tipoSeccionId"])
    const registro = await recurso.crear.ejecutar(contextoHttpCms(req), entrada)
    return reply.code(201).send(salidaContenidoSeccion(registro))
  })
  app.patch<{ Params: { id: string } }>(`${base}/:id`, { schema: { ...comun, summary: 'Editar ContenidoSeccion', params: S.paramsSchemaCms, body: editarContenidoSeccionSchema, response: { 200: salidaContenidoSeccionSchema, ...S.erroresSchemaCms } } }, async req => {
    const body = cuerpoHttpCms(req), version = versionHttpCms(body.version)
    return salidaContenidoSeccion(await recurso.editar.ejecutar(contextoHttpCms(req), idHttpCms(req.params.id), version, entradaHttpCms<DatosEditar>(body, [])))
  })
  app.patch<{ Params: { id: string } }>(`${base}/:id/activar`, { schema: { ...comun, summary: 'activar ContenidoSeccion', params: S.paramsSchemaCms, body: S.objetoCms({ version: S.versionSchemaCms }), response: { 200: salidaContenidoSeccionSchema, ...S.erroresSchemaCms } } }, async req => {
    const body = cuerpoHttpCms(req), version = versionHttpCms(body.version)
    return salidaContenidoSeccion(await recurso.activar.ejecutar(contextoHttpCms(req), idHttpCms(req.params.id), version))
  })
  app.patch<{ Params: { id: string } }>(`${base}/:id/eliminar`, { schema: { ...comun, summary: 'eliminar ContenidoSeccion', params: S.paramsSchemaCms, body: S.objetoCms({ version: S.versionSchemaCms }), response: { 200: salidaContenidoSeccionSchema, ...S.erroresSchemaCms } } }, async req => {
    const body = cuerpoHttpCms(req), version = versionHttpCms(body.version)
    return salidaContenidoSeccion(await recurso.eliminar.ejecutar(contextoHttpCms(req), idHttpCms(req.params.id), version))
  })
  app.patch<{ Params: { id: string } }>(`${base}/:id/visibilidad`, { schema: { ...comun, summary: 'fijarVisibilidad ContenidoSeccion', params: S.paramsSchemaCms, body: S.objetoCms({ version: S.versionSchemaCms, mostrar: { type: 'boolean' } }), response: { 200: salidaContenidoSeccionSchema, ...S.erroresSchemaCms } } }, async req => {
    const body = cuerpoHttpCms(req), version = versionHttpCms(body.version)
    return salidaContenidoSeccion(await recurso.fijarVisibilidad.ejecutar(contextoHttpCms(req), idHttpCms(req.params.id), version, body.mostrar as boolean))
  })
  app.patch<{ Params: { id: string } }>(`${base}/:id/inactivar`, { schema: { ...comun, summary: 'inactivar ContenidoSeccion', params: S.paramsSchemaCms, body: S.objetoCms({ version: S.versionSchemaCms }), response: { 200: salidaContenidoSeccionSchema, ...S.erroresSchemaCms } } }, async req => {
    const body = cuerpoHttpCms(req), version = versionHttpCms(body.version)
    return salidaContenidoSeccion(await recurso.inactivar.ejecutar(contextoHttpCms(req), idHttpCms(req.params.id), version))
  })
  app.patch<{ Params: { id: string } }>(`${base}/:id/reordenar`, { schema: { ...comun, summary: 'reordenar ContenidoSeccion', params: S.paramsSchemaCms, body: S.objetoCms({ version: S.versionSchemaCms, orden: S.ordenSchemaCms }), response: { 200: salidaContenidoSeccionSchema, ...S.erroresSchemaCms } } }, async req => {
    const body = cuerpoHttpCms(req), version = versionHttpCms(body.version)
    return salidaContenidoSeccion(await recurso.reordenar.ejecutar(contextoHttpCms(req), idHttpCms(req.params.id), version, body.orden as number))
  })
}
