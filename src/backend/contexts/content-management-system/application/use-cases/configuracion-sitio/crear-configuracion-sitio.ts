import type { RepositorioConfiguracionesSitio } from '../../ports/repositorio-configuracion-sitio.js'
import type { AutorizacionCms, ContextoAccionCms } from '../../seguridad-cms.js'
import { permitirCms } from '../../seguridad-cms.js'
import type { RelojCms } from '../../operaciones-cms.js'
import { contextoEscrituraCms } from '../../operaciones-cms.js'
import { normalizarCrearConfiguracionSitio } from './datos-configuracion-sitio.js'
import type { DatosCrearConfiguracionSitio } from './datos-configuracion-sitio.js'

export class CrearConfiguracionSitio {
  constructor(private readonly repo: RepositorioConfiguracionesSitio, private readonly auth: AutorizacionCms, private readonly reloj: RelojCms) {}
  async ejecutar(contexto: ContextoAccionCms, entrada: DatosCrearConfiguracionSitio) {
    await permitirCms(this.auth, contexto.actorId, 'configuracion_sitio', 'manage')
    const datos = normalizarCrearConfiguracionSitio(entrada)
    const escritura = contextoEscrituraCms(contexto, this.reloj)
    return this.repo.crear(datos, escritura)
  }
}
