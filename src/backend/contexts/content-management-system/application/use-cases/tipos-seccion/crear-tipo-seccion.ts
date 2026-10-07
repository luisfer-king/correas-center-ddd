import type { RepositorioTiposSeccion } from '../../ports/repositorio-tipo-seccion.js'
import type { AutorizacionCms, ContextoAccionCms } from '../../seguridad-cms.js'
import { permitirCms } from '../../seguridad-cms.js'
import type { RelojCms } from '../../operaciones-cms.js'
import { contextoEscrituraCms } from '../../operaciones-cms.js'
import { normalizarCrearTipoSeccion } from './datos-tipo-seccion.js'
import type { DatosCrearTipoSeccion } from './datos-tipo-seccion.js'

export class CrearTipoSeccion {
  constructor(private readonly repo: RepositorioTiposSeccion, private readonly auth: AutorizacionCms, private readonly reloj: RelojCms) {}
  async ejecutar(contexto: ContextoAccionCms, entrada: DatosCrearTipoSeccion) {
    await permitirCms(this.auth, contexto.actorId, 'tipos_seccion', 'manage')
    const datos = normalizarCrearTipoSeccion(entrada)
    const escritura = contextoEscrituraCms(contexto, this.reloj)
    return this.repo.crear(datos, escritura)
  }
}
