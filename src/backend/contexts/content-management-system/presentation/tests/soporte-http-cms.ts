import Fastify from 'fastify'
import cookie from '@fastify/cookie'
import swagger from '@fastify/swagger'
import { componerCms } from '../../infrastructure/componer-cms.js'
import { registrarRutasCms } from '../registrar-rutas-cms.js'
import type { SesionCms } from '../http-cms.js'
import type { FuentesWizardCms } from '../../application/validaciones-cms.js'
import { CatalogoFuentesWizardCms } from '../../application/validaciones-cms.js'
import { entorno, actor, antes, despues } from '../../infrastructure/tests/soporte-pruebas-cms.js'
export { actor, antes, despues }
export const lectura = { cookie: 'cc_portal_local=ok', 'user-agent': 'prueba-http-cms' }
export const escritura = { ...lectura, origin: 'http://localhost:5173', 'x-portal-request': '1' }
export async function servidorCms(modelo = 'tipoSeccion', fuentesWizard?: FuentesWizardCms) {
  const env = entorno(modelo)
  const roles = { superAdmin: false }
  const auth = {
    ejecutar: async (_actor: string, _codigo: string) => { if (!env.opciones.permiso) throw new Error('Acceso denegado') },
    tieneRolActivo: async () => roles.superAdmin,
    tienePermiso: async () => env.opciones.permiso,
  }
  const casos = componerCms(env.db, { autorizacion: auth, reloj: { ahora: () => despues }, fuentesWizard: fuentesWizard ?? new CatalogoFuentesWizardCms({ productos: ['nombre'], industrias: [], categorias: ['producto_id'], texto: [] }) })
  const iam = { comprobar: { ejecutar: async (jwt: string) => {
    if (jwt !== 'ok') throw new Error('Sesión inválida')
    return { usuarioId: actor }
  } } } as unknown as SesionCms
  const app = Fastify({ logger: false })
  await app.register(cookie)
  await app.register(swagger, { openapi: { info: { title: 'Pruebas CMS', version: '1' }, components: { securitySchemes: { cookieAuth: { type: 'apiKey', in: 'cookie', name: 'cc_portal_local' } } } } })
  // Representa rutas existentes fuera del scope CMS.
  app.get('/api/health', async () => ({ status: 'ok' }))
  await app.register(async scope => registrarRutasCms(scope, casos, iam, { origen: 'http://localhost:5173', cookie: 'cc_portal_local', secure: false }))
  await app.ready()
  return { app, env, roles, casos }
}
