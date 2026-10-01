import type { FastifyInstance } from 'fastify'
import { registrarRutasImagenes } from '../../../shared/imagenes/registrar-rutas-imagenes.js'
import type { CasosIam } from '../../identity-access-management/infrastructure/componer-iam.js'
import { exigirOrigen, exigirSesion, type SeguridadIam } from '../../identity-access-management/presentation/seguridad-http.js'
import type { CasosCatalogo } from '../infrastructure/componer-catalogo.js'
export function rutasImagenesCatalogo(app: FastifyInstance, catalogo: CasosCatalogo, iam: CasosIam, config: SeguridadIam) {
    registrarRutasImagenes(app, {
        rutaCarga: '/api/portal/catalogo/imagenes', rutaPublica: '/api/public/catalogo/imagenes',
        directorio: process.env.CATALOGO_IMAGENES_DIR || 'storage/catalogo',
        recursos: ['productos', 'categorias', 'marcas', 'industrias', 'servicios'],
        origen: exigirOrigen(config),
        autorizar: async (req, reply, recurso) => {
            const actor = await exigirSesion(iam, config)(req, reply)
            if (!actor) return false
            const capacidades = await catalogo.capacidades.ejecutar(actor)
            return capacidades.recursos[recurso]?.gestionar === true
        },
    })
}
