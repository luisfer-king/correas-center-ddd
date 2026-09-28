import type { FastifyInstance } from 'fastify'
import type { CasosIam } from '../infrastructure/componer-iam.js'
import { conContextoAuditoriaHttp } from '../infrastructure/contexto-auditoria-http.js'
import { registrarErroresIam } from './errores-http.js'
import { rutasAuditoria } from './rutas-auditoria.js'
import { rutasMiPerfil } from './rutas-mi-perfil.js'
import { rutasPermisos } from './rutas-permisos.js'
import { rutasRoles } from './rutas-roles.js'
import { rutasSesiones } from './rutas-sesiones.js'
import { rutasUsuarios } from './rutas-usuarios.js'
import type { SeguridadIam } from './seguridad-http.js'

export async function registrarRutasIam(app: FastifyInstance, casos: CasosIam, config: SeguridadIam) {
    app.addHook('onRequest', (request, _reply, done) => {
        // request.ip respeta trustProxy=false: no confiar en X-Forwarded-For arbitrario.
        const agente = request.headers['user-agent']?.replace(/[\r\n\u0000-\u001f\u007f]/g, '').slice(0, 2048) || null
        conContextoAuditoriaHttp({ ipAddress: request.ip || null, userAgent: agente }, done)
    })
    // Un único ámbito de errores para el contexto; los controladores delegan toda regla al caso de uso.
    registrarErroresIam(app)
    rutasSesiones(app, casos, config)
    rutasRoles(app, casos, config)
    rutasPermisos(app, casos, config)
    rutasUsuarios(app, casos, config)
    rutasMiPerfil(app, casos, config)
    rutasAuditoria(app, casos, config)
}
