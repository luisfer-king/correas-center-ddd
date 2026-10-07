import type { FastifyInstance } from 'fastify'
import { registrarRutasImagenes } from '../../../shared/imagenes/registrar-rutas-imagenes.js'
import { exigirOrigen, exigirSesion, type SeguridadIam } from '../../identity-access-management/presentation/seguridad-http.js'
import type { CasosIam } from '../../identity-access-management/infrastructure/componer-iam.js'
import type { SesionCms } from './http-cms.js'
import type { CasosCms } from '../infrastructure/componer-cms.js'
export function rutasImagenesCms(app: FastifyInstance, cms: CasosCms, iam: SesionCms, config: SeguridadIam) {
  registrarRutasImagenes(app, {
    rutaCarga: '/api/portal/cms/imagenes', rutaPublica: '/api/public/cms/imagenes',
    directorio: process.env.CMS_IMAGENES_DIR || 'storage/cms', recursos: ['contenidos-seccion'],
    origen: exigirOrigen(config),
    autorizar: async (req, reply) => {
      const actor = await exigirSesion(iam as CasosIam, config)(req, reply)
      if (!actor) return false
      return (await cms.capacidades.ejecutar(actor)).recursos.contenidos_seccion.gestionar
    },
  })
}
