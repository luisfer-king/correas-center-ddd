import type { RepositorioRegistrosCMS } from '../../ports/repositorio-registro-cms.js'
import type { AutorizacionCms, ContextoAccionCms } from '../../seguridad-cms.js'
import { permitirCms } from '../../seguridad-cms.js'
import type { RelojCms } from '../../operaciones-cms.js'
import { contextoEscrituraCms } from '../../operaciones-cms.js'
import { normalizarCrearRegistroCMS } from './datos-registro-cms.js'
import type { DatosCrearRegistroCMS } from './datos-registro-cms.js'

export class CrearRegistroCMS {
  constructor(private readonly repo: RepositorioRegistrosCMS, private readonly auth: AutorizacionCms, private readonly reloj: RelojCms) {}
  async ejecutar(contexto: ContextoAccionCms, entrada: DatosCrearRegistroCMS) {
    await permitirCms(this.auth, contexto.actorId, 'registros_cms', 'manage')
    const datos = normalizarCrearRegistroCMS(entrada)
    const escritura = contextoEscrituraCms(contexto, this.reloj)
    return this.repo.crear(datos, escritura)
  }
}
