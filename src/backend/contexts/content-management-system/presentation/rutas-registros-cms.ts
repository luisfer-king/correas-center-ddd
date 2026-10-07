import type { FastifyInstance } from 'fastify'
import type { CasosCms } from '../infrastructure/componer-cms.js'
import * as S from './esquemas-cms.js'
import { crearRegistroCMSSchema, editarRegistroCMSSchema, salidaRegistroCMSSchema } from './esquemas-registro-cms.js'
import { salidaRegistroCMS } from './salidas-registro-cms.js'
import { contextoHttpCms, cuerpoHttpCms, entradaHttpCms, consultaHttpCms, leerHttpCms, versionHttpCms, idHttpCms } from './http-cms.js'
type DatosCrear = Parameters<CasosCms['registros-cms']['crear']['ejecutar']>[1]
type DatosEditar = Parameters<CasosCms['registros-cms']['editar']['ejecutar']>[3]
type Consulta = Parameters<CasosCms['registros-cms']['listar']['ejecutar']>[1]

export function rutasRegistrosCMS(app: FastifyInstance, casos: CasosCms): void {
  const base = '/api/portal/cms/registros-cms'
  const recurso = casos['registros-cms']
  const comun = { tags: ['CMS · RegistrosCMS'], security: [{ cookieAuth: [] }] }
  app.get(base, { schema: { ...comun, summary: 'Listar RegistrosCMS', querystring: S.querySchemaCms([], false), response: { 200: { type: 'array', items: salidaRegistroCMSSchema }, ...S.erroresSchemaCms } } }, async req => {
    const ctx = contextoHttpCms(req)
    return leerHttpCms(casos, req, 'registros_cms', async () => (await recurso.listar.ejecutar(ctx.actorId, consultaHttpCms<Consulta>(req.query, []))).map(salidaRegistroCMS))
  })
  app.get<{ Params: { id: string } }>(`${base}/:id`, { schema: { ...comun, summary: 'Consultar RegistroCMS', params: S.paramsSchemaCms, response: { 200: salidaRegistroCMSSchema, ...S.erroresSchemaCms } } }, async req => {
    const ctx = contextoHttpCms(req), id = idHttpCms(req.params.id)
    return leerHttpCms(casos, req, 'registros_cms', async () => salidaRegistroCMS(await recurso.obtener.ejecutar(ctx.actorId, id)), req.params.id)
  })
  app.post(base, { schema: { ...comun, summary: 'Crear RegistroCMS', body: crearRegistroCMSSchema, response: { 201: salidaRegistroCMSSchema, ...S.erroresSchemaCms } } }, async (req, reply) => {
    const entrada = entradaHttpCms<DatosCrear>(cuerpoHttpCms(req), [])
    const registro = await recurso.crear.ejecutar(contextoHttpCms(req), entrada)
    return reply.code(201).send(salidaRegistroCMS(registro))
  })
  app.patch<{ Params: { id: string } }>(`${base}/:id`, { schema: { ...comun, summary: 'Editar RegistroCMS', params: S.paramsSchemaCms, body: editarRegistroCMSSchema, response: { 200: salidaRegistroCMSSchema, ...S.erroresSchemaCms } } }, async req => {
    const body = cuerpoHttpCms(req), version = versionHttpCms(body.version)
    return salidaRegistroCMS(await recurso.editar.ejecutar(contextoHttpCms(req), idHttpCms(req.params.id), version, entradaHttpCms<DatosEditar>(body, [])))
  })
  app.patch<{ Params: { id: string } }>(`${base}/:id/activar`, { schema: { ...comun, summary: 'activar RegistroCMS', params: S.paramsSchemaCms, body: S.objetoCms({ version: S.versionSchemaCms }), response: { 200: salidaRegistroCMSSchema, ...S.erroresSchemaCms } } }, async req => {
    const body = cuerpoHttpCms(req), version = versionHttpCms(body.version)
    return salidaRegistroCMS(await recurso.activar.ejecutar(contextoHttpCms(req), idHttpCms(req.params.id), version))
  })
  app.patch<{ Params: { id: string } }>(`${base}/:id/eliminar`, { schema: { ...comun, summary: 'eliminar RegistroCMS', params: S.paramsSchemaCms, body: S.objetoCms({ version: S.versionSchemaCms }), response: { 200: salidaRegistroCMSSchema, ...S.erroresSchemaCms } } }, async req => {
    const body = cuerpoHttpCms(req), version = versionHttpCms(body.version)
    return salidaRegistroCMS(await recurso.eliminar.ejecutar(contextoHttpCms(req), idHttpCms(req.params.id), version))
  })
  app.patch<{ Params: { id: string } }>(`${base}/:id/inactivar`, { schema: { ...comun, summary: 'inactivar RegistroCMS', params: S.paramsSchemaCms, body: S.objetoCms({ version: S.versionSchemaCms }), response: { 200: salidaRegistroCMSSchema, ...S.erroresSchemaCms } } }, async req => {
    const body = cuerpoHttpCms(req), version = versionHttpCms(body.version)
    return salidaRegistroCMS(await recurso.inactivar.ejecutar(contextoHttpCms(req), idHttpCms(req.params.id), version))
  })
  app.patch<{ Params: { id: string } }>(`${base}/:id/reordenar`, { schema: { ...comun, summary: 'reordenar RegistroCMS', params: S.paramsSchemaCms, body: S.objetoCms({ version: S.versionSchemaCms, orden: S.ordenSchemaCms }), response: { 200: salidaRegistroCMSSchema, ...S.erroresSchemaCms } } }, async req => {
    const body = cuerpoHttpCms(req), version = versionHttpCms(body.version)
    return salidaRegistroCMS(await recurso.reordenar.ejecutar(contextoHttpCms(req), idHttpCms(req.params.id), version, body.orden as number))
  })
}
