import type { FastifyInstance } from 'fastify'
import type { CasosIam } from '../infrastructure/componer-iam.js'
import { registrarErroresIam } from './errores-http.js'
import { rutasAuditoria } from './rutas-auditoria.js'
import { rutasPermisos } from './rutas-permisos.js'
import { rutasRoles } from './rutas-roles.js'
import { rutasSesiones } from './rutas-sesiones.js'
import { rutasUsuarios } from './rutas-usuarios.js'
import type { SeguridadIam } from './seguridad-http.js'

export async function registrarRutasIam(app: FastifyInstance, casos: CasosIam, config: SeguridadIam) {
    // Un único ámbito de errores para el contexto; los controladores delegan toda regla al caso de uso.
    registrarErroresIam(app)
    rutasSesiones(app, casos, config)
    rutasRoles(app, casos, config)
    rutasPermisos(app, casos, config)
    rutasUsuarios(app, casos, config)
    rutasAuditoria(app, casos, config)
}