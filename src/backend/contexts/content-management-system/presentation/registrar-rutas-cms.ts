import { rutasImagenesCms } from './rutas-imagenes-cms.js'
import type { FastifyInstance } from 'fastify'
import type { CasosCms } from '../infrastructure/componer-cms.js'
import type { SeguridadIam } from '../../identity-access-management/presentation/seguridad-http.js'
import { seguridadHttpCms, contextoHttpCms, leerHttpCms } from './http-cms.js'
import type { SesionCms } from './http-cms.js'
import { registrarErroresCms } from './errores-http-cms.js'
import { rutasTiposSeccion } from './rutas-tipos-seccion.js'
import { rutasContenidosSeccion } from './rutas-contenidos-seccion.js'
import { rutasMenus } from './rutas-menus.js'
import { rutasItemsMenu } from './rutas-items-menu.js'
import { rutasElementosFooter } from './rutas-elementos-footer.js'
import { rutasConfiguracionesSitio } from './rutas-configuracion-sitio.js'
import { rutasPasosWizard } from './rutas-pasos-wizard.js'
import { rutasRegistrosCMS } from './rutas-registros-cms.js'
import { rutasContenidosRegistro } from './rutas-contenidos-registro.js'
import { rutasMetadataSeccion } from './rutas-metadata-seccion.js'
import { recursosCms } from '../application/use-cases/autorizacion/obtener-capacidades-cms.js'
import * as S from './esquemas-cms.js'

/** Registrar en un scope de Fastify propio para mantener aislados los hooks y errores. */
export async function registrarRutasCms(app: FastifyInstance, casos: CasosCms, iam: SesionCms, config: SeguridadIam): Promise<void> {
  registrarErroresCms(app)
  rutasImagenesCms(app, casos, iam, config)
  await app.register(async app => {
  seguridadHttpCms(app, iam, config)
  const capacidades = S.objetoCms({ verEliminados: { type: 'boolean' }, recursos: S.objetoCms(Object.fromEntries(recursosCms.map(r => [r, S.objetoCms({ leer: { type: 'boolean' }, gestionar: { type: 'boolean' } })]))) })
  app.get('/api/portal/cms/capacidades', { schema: { tags: ['CMS'], summary: 'Consultar capacidades CMS', security: [{ cookieAuth: [] }], response: { 200: capacidades, ...S.erroresSchemaCms } } }, async req => {
    return leerHttpCms(casos, req, 'portal', () => casos.capacidades.ejecutar(contextoHttpCms(req).actorId))
  })
  rutasTiposSeccion(app, casos)
  rutasContenidosSeccion(app, casos)
  rutasMetadataSeccion(app, casos)
  rutasMenus(app, casos)
  rutasItemsMenu(app, casos)
  rutasElementosFooter(app, casos)
  rutasConfiguracionesSitio(app, casos)
  rutasPasosWizard(app, casos)
  rutasRegistrosCMS(app, casos)
  rutasContenidosRegistro(app, casos)
  })
}
