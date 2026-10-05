import type { FastifyInstance } from 'fastify'
import type { CasosCms } from '../infrastructure/componer-cms.js'
import * as S from './esquemas-cms.js'
import { crearConfiguracionSitioSchema, editarConfiguracionSitioSchema, salidaConfiguracionSitioSchema } from './esquemas-configuracion-sitio.js'
import { salidaConfiguracionSitio } from './salidas-configuracion-sitio.js'
import { contextoHttpCms, cuerpoHttpCms, entradaHttpCms, consultaHttpCms, leerHttpCms, versionHttpCms, idConfiguracionHttpCms } from './http-cms.js'
type DatosCrear = Parameters<CasosCms['configuracion-sitio']['crear']['ejecutar']>[1]
type DatosEditar = Parameters<CasosCms['configuracion-sitio']['editar']['ejecutar']>[3]
type Consulta = Parameters<CasosCms['configuracion-sitio']['listar']['ejecutar']>[1]

export function rutasConfiguracionesSitio(app: FastifyInstance, casos: CasosCms): void {
  const base = '/api/portal/cms/configuracion-sitio'
  const recurso = casos['configuracion-sitio']
  const comun = { tags: ['CMS · ConfiguracionesSitio'], security: [{ cookieAuth: [] }] }
  app.get(base, { schema: { ...comun, summary: 'Listar ConfiguracionesSitio', querystring: S.querySchemaCms(["empresaId"], true), response: { 200: { type: 'array', items: salidaConfiguracionSitioSchema }, ...S.erroresSchemaCms } } }, async req => {
    const ctx = contextoHttpCms(req)
    return leerHttpCms(casos, req, 'configuracion_sitio', async () => (await recurso.listar.ejecutar(ctx.actorId, consultaHttpCms<Consulta>(req.query, ["empresaId"]))).map(salidaConfiguracionSitio))
  })
  app.get<{ Params: { id: string } }>(`${base}/:id`, { schema: { ...comun, summary: 'Consultar ConfiguracionSitio', params: S.paramsSchemaCms, response: { 200: salidaConfiguracionSitioSchema, ...S.erroresSchemaCms } } }, async req => {
    const ctx = contextoHttpCms(req), id = idConfiguracionHttpCms(req.params.id)
    return leerHttpCms(casos, req, 'configuracion_sitio', async () => salidaConfiguracionSitio(await recurso.obtener.ejecutar(ctx.actorId, id)), req.params.id)
  })
  app.post(base, { schema: { ...comun, summary: 'Crear ConfiguracionSitio', body: crearConfiguracionSitioSchema, response: { 201: salidaConfiguracionSitioSchema, ...S.erroresSchemaCms } } }, async (req, reply) => {
    const entrada = entradaHttpCms<DatosCrear>(cuerpoHttpCms(req), ["empresaId"])
    const registro = await recurso.crear.ejecutar(contextoHttpCms(req), entrada)
    return reply.code(201).send(salidaConfiguracionSitio(registro))
  })
  app.patch<{ Params: { id: string } }>(`${base}/:id`, { schema: { ...comun, summary: 'Editar ConfiguracionSitio', params: S.paramsSchemaCms, body: editarConfiguracionSitioSchema, response: { 200: salidaConfiguracionSitioSchema, ...S.erroresSchemaCms } } }, async req => {
    const body = cuerpoHttpCms(req), version = body.version === null ? null : versionHttpCms(body.version)
    return salidaConfiguracionSitio(await recurso.editar.ejecutar(contextoHttpCms(req), idConfiguracionHttpCms(req.params.id), version, entradaHttpCms<DatosEditar>(body, [])))
  })
  app.patch<{ Params: { id: string } }>(`${base}/:id/actividad`, { schema: { ...comun, summary: 'cambiarActividad ConfiguracionSitio', params: S.paramsSchemaCms, body: S.objetoCms({ version: S.nullableCms(S.versionSchemaCms), activo: { type: 'boolean' } }), response: { 200: salidaConfiguracionSitioSchema, ...S.erroresSchemaCms } } }, async req => {
    const body = cuerpoHttpCms(req), version = body.version === null ? null : versionHttpCms(body.version)
    return salidaConfiguracionSitio(await recurso.cambiarActividad.ejecutar(contextoHttpCms(req), idConfiguracionHttpCms(req.params.id), version, body.activo as boolean))
  })
}
