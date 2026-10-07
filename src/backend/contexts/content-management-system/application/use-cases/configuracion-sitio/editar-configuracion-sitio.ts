import type { RepositorioConfiguracionesSitio } from '../../ports/repositorio-configuracion-sitio.js'
import type { AutorizacionCms, ContextoAccionCms } from '../../seguridad-cms.js'
import { permitirCms } from '../../seguridad-cms.js'
import type { RelojCms } from '../../operaciones-cms.js'
import { contextoEscrituraCms, exigirVersionCms, idConfiguracionCms } from '../../operaciones-cms.js'
import { normalizarEditarConfiguracionSitio } from './datos-configuracion-sitio.js'
import type { DatosEditarConfiguracionSitio } from './datos-configuracion-sitio.js'

export class EditarConfiguracionSitio {
  constructor(private readonly repo: RepositorioConfiguracionesSitio, private readonly auth: AutorizacionCms, private readonly reloj: RelojCms) {}
  async ejecutar(contexto: ContextoAccionCms, id: number, version: Date | null, entrada: DatosEditarConfiguracionSitio) {
    await permitirCms(this.auth, contexto.actorId, 'configuracion_sitio', 'manage')
    const entidad = await this.repo.obtener(idConfiguracionCms(id))
    if (!entidad) throw new Error('Configuración no disponible')
    exigirVersionCms(entidad.actualizadoEn, version)
    const datos = normalizarEditarConfiguracionSitio(entrada)
    const escritura = contextoEscrituraCms(contexto, this.reloj, version)
    entidad.editar(datos, escritura.cuando)
    await this.repo.guardar(entidad, version, escritura)
    return entidad
  }
}
