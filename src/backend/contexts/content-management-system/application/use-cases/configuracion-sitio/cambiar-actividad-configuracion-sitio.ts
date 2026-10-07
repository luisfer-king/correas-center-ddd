import type { RepositorioConfiguracionesSitio } from '../../ports/repositorio-configuracion-sitio.js'
import type { AutorizacionCms, ContextoAccionCms } from '../../seguridad-cms.js'
import { permitirCms } from '../../seguridad-cms.js'
import type { RelojCms } from '../../operaciones-cms.js'
import { contextoEscrituraCms, exigirVersionCms, idConfiguracionCms } from '../../operaciones-cms.js'
import { booleanoCms } from '../../validaciones-cms.js'

export class CambiarActividadConfiguracionSitio {
  constructor(private readonly repo: RepositorioConfiguracionesSitio, private readonly auth: AutorizacionCms, private readonly reloj: RelojCms) {}
  async ejecutar(contexto: ContextoAccionCms, id: number, version: Date | null, activo: boolean) {
    await permitirCms(this.auth, contexto.actorId, 'configuracion_sitio', 'manage')
    const entidad = await this.repo.obtener(idConfiguracionCms(id))
    if (!entidad) throw new Error('Configuración no disponible')
    exigirVersionCms(entidad.actualizadoEn, version)
    const escritura = contextoEscrituraCms(contexto, this.reloj, version)
    entidad.cambiarActivo(booleanoCms(activo), escritura.cuando)
    await this.repo.guardar(entidad, version, escritura)
    return entidad
  }
}
