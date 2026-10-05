import type { FastifyInstance } from 'fastify'
import type { CasosCms } from '../infrastructure/componer-cms.js'
import * as S from './esquemas-cms.js'
import { contextoHttpCms, cuerpoHttpCms, leerHttpCms, idHttpCms, versionHttpCms } from './http-cms.js'
import { salidaContenidoSeccion } from './salidas-contenido-seccion.js'
import { salidaContenidoSeccionSchema } from './esquemas-contenido-seccion.js'
export function rutasMetadataSeccion(app: FastifyInstance, casos: CasosCms): void {
  const base = '/api/portal/cms/contenidos-seccion/:id/metadata'
  const comun = { tags: ['CMS · Metadata'], security: [{ cookieAuth: [] }], params: S.paramsSchemaCms }
  const salida = S.objetoCms({ contenidoSeccionId: S.idSchemaCms, empresaId: S.idSchemaCms, tipoSeccionId: S.idSchemaCms,
    metadata: { type: 'object', additionalProperties: true }, actualizadoEn: S.versionSchemaCms })
  app.get<{ Params: { id: string } }>(base, { schema: { ...comun, summary: 'Consultar metadata de sección', response: { 200: salida, ...S.erroresSchemaCms } } }, async req => {
    return leerHttpCms(casos, req, 'metadata_seccion', async () => {
      const e = await casos['metadata-seccion'].obtener.ejecutar(contextoHttpCms(req).actorId, idHttpCms(req.params.id))
      return { ...e, contenidoSeccionId: e.contenidoSeccionId.toString(), empresaId: e.empresaId.toString(), tipoSeccionId: e.tipoSeccionId.toString(), actualizadoEn: e.actualizadoEn.toISOString() }
    }, req.params.id)
  })
  app.put<{ Params: { id: string } }>(base, { schema: { ...comun, summary: 'Reemplazar metadata de sección',
    body: S.objetoCms({ version: S.versionSchemaCms, metadata: { type: 'object', additionalProperties: true } }), response: { 200: salidaContenidoSeccionSchema, ...S.erroresSchemaCms } } }, async req => {
    const body = cuerpoHttpCms(req)
    return salidaContenidoSeccion(await casos['metadata-seccion'].reemplazar.ejecutar(contextoHttpCms(req), idHttpCms(req.params.id), versionHttpCms(body.version), body.metadata))
  })
}
