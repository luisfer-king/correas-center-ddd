import type { FastifyInstance } from 'fastify'
import type { CasosCms } from '../infrastructure/componer-cms.js'
import * as S from './esquemas-cms.js'
import { crearTipoSeccionSchema, editarTipoSeccionSchema, salidaTipoSeccionSchema } from './esquemas-tipo-seccion.js'
import { salidaTipoSeccion } from './salidas-tipo-seccion.js'
import { contextoHttpCms, cuerpoHttpCms, entradaHttpCms, consultaHttpCms, leerHttpCms, versionHttpCms, idHttpCms } from './http-cms.js'
type DatosCrear = Parameters<CasosCms['tipos-seccion']['crear']['ejecutar']>[1]
type DatosEditar = Parameters<CasosCms['tipos-seccion']['editar']['ejecutar']>[3]
type Consulta = Parameters<CasosCms['tipos-seccion']['listar']['ejecutar']>[1]

export function rutasTiposSeccion(app: FastifyInstance, casos: CasosCms): void {
  const base = '/api/portal/cms/tipos-seccion'
  const recurso = casos['tipos-seccion']
  const comun = { tags: ['CMS · TiposSeccion'], security: [{ cookieAuth: [] }] }
  app.get(base, { schema: { ...comun, summary: 'Listar TiposSeccion', querystring: S.querySchemaCms([], false), response: { 200: { type: 'array', items: salidaTipoSeccionSchema }, ...S.erroresSchemaCms } } }, async req => {
    const ctx = contextoHttpCms(req)
    return leerHttpCms(casos, req, 'tipos_seccion', async () => (await recurso.listar.ejecutar(ctx.actorId, consultaHttpCms<Consulta>(req.query, []))).map(salidaTipoSeccion))
  })
  app.get<{ Params: { id: string } }>(`${base}/:id`, { schema: { ...comun, summary: 'Consultar TipoSeccion', params: S.paramsSchemaCms, response: { 200: salidaTipoSeccionSchema, ...S.erroresSchemaCms } } }, async req => {
    const ctx = contextoHttpCms(req), id = idHttpCms(req.params.id)
    return leerHttpCms(casos, req, 'tipos_seccion', async () => salidaTipoSeccion(await recurso.obtener.ejecutar(ctx.actorId, id)), req.params.id)
  })
  app.post(base, { schema: { ...comun, summary: 'Crear TipoSeccion', body: crearTipoSeccionSchema, response: { 201: salidaTipoSeccionSchema, ...S.erroresSchemaCms } } }, async (req, reply) => {
    const entrada = entradaHttpCms<DatosCrear>(cuerpoHttpCms(req), [])
    const registro = await recurso.crear.ejecutar(contextoHttpCms(req), entrada)
    return reply.code(201).send(salidaTipoSeccion(registro))
  })
  app.patch<{ Params: { id: string } }>(`${base}/:id`, { schema: { ...comun, summary: 'Editar TipoSeccion', params: S.paramsSchemaCms, body: editarTipoSeccionSchema, response: { 200: salidaTipoSeccionSchema, ...S.erroresSchemaCms } } }, async req => {
    const body = cuerpoHttpCms(req), version = versionHttpCms(body.version)
    return salidaTipoSeccion(await recurso.editar.ejecutar(contextoHttpCms(req), idHttpCms(req.params.id), version, entradaHttpCms<DatosEditar>(body, [])))
  })
  app.patch<{ Params: { id: string } }>(`${base}/:id/activar`, { schema: { ...comun, summary: 'activar TipoSeccion', params: S.paramsSchemaCms, body: S.objetoCms({ version: S.versionSchemaCms }), response: { 200: salidaTipoSeccionSchema, ...S.erroresSchemaCms } } }, async req => {
    const body = cuerpoHttpCms(req), version = versionHttpCms(body.version)
    return salidaTipoSeccion(await recurso.activar.ejecutar(contextoHttpCms(req), idHttpCms(req.params.id), version))
  })
  app.patch<{ Params: { id: string } }>(`${base}/:id/claves`, { schema: { ...comun, summary: 'cambiarClaves TipoSeccion', params: S.paramsSchemaCms, body: S.objetoCms({ version: S.versionSchemaCms, claves: { type: 'array', uniqueItems: true, items: S.textoObligatorioSchemaCms } }), response: { 200: salidaTipoSeccionSchema, ...S.erroresSchemaCms } } }, async req => {
    const body = cuerpoHttpCms(req), version = versionHttpCms(body.version)
    return salidaTipoSeccion(await recurso.cambiarClaves.ejecutar(contextoHttpCms(req), idHttpCms(req.params.id), version, body.claves as unknown))
  })
  app.patch<{ Params: { id: string } }>(`${base}/:id/eliminar`, { schema: { ...comun, summary: 'eliminar TipoSeccion', params: S.paramsSchemaCms, body: S.objetoCms({ version: S.versionSchemaCms }), response: { 200: salidaTipoSeccionSchema, ...S.erroresSchemaCms } } }, async req => {
    const body = cuerpoHttpCms(req), version = versionHttpCms(body.version)
    return salidaTipoSeccion(await recurso.eliminar.ejecutar(contextoHttpCms(req), idHttpCms(req.params.id), version))
  })
  app.patch<{ Params: { id: string } }>(`${base}/:id/inactivar`, { schema: { ...comun, summary: 'inactivar TipoSeccion', params: S.paramsSchemaCms, body: S.objetoCms({ version: S.versionSchemaCms }), response: { 200: salidaTipoSeccionSchema, ...S.erroresSchemaCms } } }, async req => {
    const body = cuerpoHttpCms(req), version = versionHttpCms(body.version)
    return salidaTipoSeccion(await recurso.inactivar.ejecutar(contextoHttpCms(req), idHttpCms(req.params.id), version))
  })
  app.patch<{ Params: { id: string } }>(`${base}/:id/reordenar`, { schema: { ...comun, summary: 'reordenar TipoSeccion', params: S.paramsSchemaCms, body: S.objetoCms({ version: S.versionSchemaCms, orden: S.ordenSchemaCms }), response: { 200: salidaTipoSeccionSchema, ...S.erroresSchemaCms } } }, async req => {
    const body = cuerpoHttpCms(req), version = versionHttpCms(body.version)
    return salidaTipoSeccion(await recurso.reordenar.ejecutar(contextoHttpCms(req), idHttpCms(req.params.id), version, body.orden as number))
  })
}
