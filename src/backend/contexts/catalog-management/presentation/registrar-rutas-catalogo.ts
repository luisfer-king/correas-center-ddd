import '@fastify/cookie'
import type { FastifyInstance } from 'fastify'
import type { CasosIam } from '../../identity-access-management/infrastructure/componer-iam.js'
import { conContextoAuditoriaHttp } from '../../identity-access-management/infrastructure/contexto-auditoria-http.js'
import { exigirSesion, type SeguridadIam } from '../../identity-access-management/presentation/seguridad-http.js'
import type { CasosCatalogo } from '../infrastructure/componer-catalogo.js'
import { registrarErroresCatalogo } from './errores-http-catalogo.js'
import { errores, respuesta } from './esquemas-catalogo.js'
import { rutasAsignacionesAtributo } from './rutas-asignaciones-atributo.js'
import { rutasAsignacionesIndustria } from './rutas-asignaciones-industria.js'
import { rutasAsignacionesMarca } from './rutas-asignaciones-marca.js'
import { rutasAtributosTecnicos } from './rutas-atributos-tecnicos.js'
import { rutasCategorias } from './rutas-categorias.js'
import { rutasImagenesCatalogo } from './rutas-imagenes-catalogo.js'
import { rutasIndustrias } from './rutas-industrias.js'
import { rutasMarcas } from './rutas-marcas.js'
import { rutasProductos } from './rutas-productos.js'
import { rutasServicios } from './rutas-servicios.js'
import { rutasTiposAtributo } from './rutas-tipos-atributo.js'
export async function registrarRutasCatalogo(app: FastifyInstance, catalogo: CasosCatalogo, iam: CasosIam, config: SeguridadIam) {
  app.addHook('onRequest', (request, _reply, done) => {
    const agente = request.headers['user-agent']?.replace(/[\r\n\u0000-\u001f\u007f]/g, '').slice(0, 2048) || null
    conContextoAuditoriaHttp({ ipAddress: request.ip || null, userAgent: agente }, done)
  })
  registrarErroresCatalogo(app)
  app.get('/api/portal/catalogo/capacidades', { schema: { tags: ['Catálogo'], security: [{ cookieAuth: [] }], response: { 200: respuesta, ...errores } } }, async (req, reply) => {
    const actor = await exigirSesion(iam, config)(req, reply); if (!actor) return reply
    const capacidades = await catalogo.capacidades.ejecutar(actor)
    await catalogo.registrarLectura.ejecutar(actor, 'portal')
    return capacidades
  })
  rutasImagenesCatalogo(app, catalogo, iam, config)
  rutasProductos(app, catalogo, iam, config)
  rutasCategorias(app, catalogo, iam, config)
  rutasMarcas(app, catalogo, iam, config)
  rutasTiposAtributo(app, catalogo, iam, config)
  rutasAtributosTecnicos(app, catalogo, iam, config)
  rutasIndustrias(app, catalogo, iam, config)
  rutasServicios(app, catalogo, iam, config)
  rutasAsignacionesMarca(app, catalogo, iam, config)
  rutasAsignacionesAtributo(app, catalogo, iam, config)
  rutasAsignacionesIndustria(app, catalogo, iam, config)
}
