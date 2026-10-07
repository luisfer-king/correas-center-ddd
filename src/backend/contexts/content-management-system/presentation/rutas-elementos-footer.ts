import type { FastifyInstance } from 'fastify'
import type { CasosCms } from '../infrastructure/componer-cms.js'
import * as S from './esquemas-cms.js'
import { crearFooterElementoSchema, editarFooterElementoSchema, salidaFooterElementoSchema } from './esquemas-footer-elemento.js'
import { salidaFooterElemento } from './salidas-footer-elemento.js'
import { contextoHttpCms, cuerpoHttpCms, entradaHttpCms, consultaHttpCms, leerHttpCms, versionHttpCms, idHttpCms } from './http-cms.js'
type DatosCrear = Parameters<CasosCms['elementos-footer']['crear']['ejecutar']>[1]
type DatosEditar = Parameters<CasosCms['elementos-footer']['editar']['ejecutar']>[3]
type Consulta = Parameters<CasosCms['elementos-footer']['listar']['ejecutar']>[1]

export function rutasElementosFooter(app: FastifyInstance, casos: CasosCms): void {
  const base = '/api/portal/cms/elementos-footer'
  const recurso = casos['elementos-footer']
  const comun = { tags: ['CMS · ElementosFooter'], security: [{ cookieAuth: [] }] }
  app.get(base, { schema: { ...comun, summary: 'Listar ElementosFooter', querystring: S.querySchemaCms(["empresaId"], false), response: { 200: { type: 'array', items: salidaFooterElementoSchema }, ...S.erroresSchemaCms } } }, async req => {
    const ctx = contextoHttpCms(req)
    return leerHttpCms(casos, req, 'elementos_footer', async () => (await recurso.listar.ejecutar(ctx.actorId, consultaHttpCms<Consulta>(req.query, ["empresaId"]))).map(salidaFooterElemento))
  })
  app.get<{ Params: { id: string } }>(`${base}/:id`, { schema: { ...comun, summary: 'Consultar FooterElemento', params: S.paramsSchemaCms, response: { 200: salidaFooterElementoSchema, ...S.erroresSchemaCms } } }, async req => {
    const ctx = contextoHttpCms(req), id = idHttpCms(req.params.id)
    return leerHttpCms(casos, req, 'elementos_footer', async () => salidaFooterElemento(await recurso.obtener.ejecutar(ctx.actorId, id)), req.params.id)
  })
  app.post(base, { schema: { ...comun, summary: 'Crear FooterElemento', body: crearFooterElementoSchema, response: { 201: salidaFooterElementoSchema, ...S.erroresSchemaCms } } }, async (req, reply) => {
    const entrada = entradaHttpCms<DatosCrear>(cuerpoHttpCms(req), ["empresaId"])
    const registro = await recurso.crear.ejecutar(contextoHttpCms(req), entrada)
    return reply.code(201).send(salidaFooterElemento(registro))
  })
  app.patch<{ Params: { id: string } }>(`${base}/:id`, { schema: { ...comun, summary: 'Editar FooterElemento', params: S.paramsSchemaCms, body: editarFooterElementoSchema, response: { 200: salidaFooterElementoSchema, ...S.erroresSchemaCms } } }, async req => {
    const body = cuerpoHttpCms(req), version = versionHttpCms(body.version)
    return salidaFooterElemento(await recurso.editar.ejecutar(contextoHttpCms(req), idHttpCms(req.params.id), version, entradaHttpCms<DatosEditar>(body, [])))
  })
  app.patch<{ Params: { id: string } }>(`${base}/:id/activar`, { schema: { ...comun, summary: 'activar FooterElemento', params: S.paramsSchemaCms, body: S.objetoCms({ version: S.versionSchemaCms }), response: { 200: salidaFooterElementoSchema, ...S.erroresSchemaCms } } }, async req => {
    const body = cuerpoHttpCms(req), version = versionHttpCms(body.version)
    return salidaFooterElemento(await recurso.activar.ejecutar(contextoHttpCms(req), idHttpCms(req.params.id), version))
  })
  app.patch<{ Params: { id: string } }>(`${base}/:id/eliminar`, { schema: { ...comun, summary: 'eliminar FooterElemento', params: S.paramsSchemaCms, body: S.objetoCms({ version: S.versionSchemaCms }), response: { 200: salidaFooterElementoSchema, ...S.erroresSchemaCms } } }, async req => {
    const body = cuerpoHttpCms(req), version = versionHttpCms(body.version)
    return salidaFooterElemento(await recurso.eliminar.ejecutar(contextoHttpCms(req), idHttpCms(req.params.id), version))
  })
  app.patch<{ Params: { id: string } }>(`${base}/:id/visibilidad`, { schema: { ...comun, summary: 'fijarVisibilidad FooterElemento', params: S.paramsSchemaCms, body: S.objetoCms({ version: S.versionSchemaCms, mostrar: { type: 'boolean' } }), response: { 200: salidaFooterElementoSchema, ...S.erroresSchemaCms } } }, async req => {
    const body = cuerpoHttpCms(req), version = versionHttpCms(body.version)
    return salidaFooterElemento(await recurso.fijarVisibilidad.ejecutar(contextoHttpCms(req), idHttpCms(req.params.id), version, body.mostrar as boolean))
  })
  app.patch<{ Params: { id: string } }>(`${base}/:id/inactivar`, { schema: { ...comun, summary: 'inactivar FooterElemento', params: S.paramsSchemaCms, body: S.objetoCms({ version: S.versionSchemaCms }), response: { 200: salidaFooterElementoSchema, ...S.erroresSchemaCms } } }, async req => {
    const body = cuerpoHttpCms(req), version = versionHttpCms(body.version)
    return salidaFooterElemento(await recurso.inactivar.ejecutar(contextoHttpCms(req), idHttpCms(req.params.id), version))
  })
  app.patch<{ Params: { id: string } }>(`${base}/:id/reordenar`, { schema: { ...comun, summary: 'reordenar FooterElemento', params: S.paramsSchemaCms, body: S.objetoCms({ version: S.versionSchemaCms, orden: S.ordenSchemaCms }), response: { 200: salidaFooterElementoSchema, ...S.erroresSchemaCms } } }, async req => {
    const body = cuerpoHttpCms(req), version = versionHttpCms(body.version)
    return salidaFooterElemento(await recurso.reordenar.ejecutar(contextoHttpCms(req), idHttpCms(req.params.id), version, body.orden as number))
  })
}
