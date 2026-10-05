import type { RepositorioContenidosRegistro } from '../../ports/repositorio-contenido-registro.js'
import type { AutorizacionCms, ContextoAccionCms } from '../../seguridad-cms.js'
import { permitirCms } from '../../seguridad-cms.js'
import type { RelojCms } from '../../operaciones-cms.js'
import { contextoEscrituraCms } from '../../operaciones-cms.js'
import { normalizarCrearContenidoRegistro } from './datos-contenido-registro.js'
import type { DatosCrearContenidoRegistro } from './datos-contenido-registro.js'

export class CrearContenidoRegistro {
  constructor(private readonly repo: RepositorioContenidosRegistro, private readonly auth: AutorizacionCms, private readonly reloj: RelojCms) {}
  async ejecutar(contexto: ContextoAccionCms, entrada: DatosCrearContenidoRegistro) {
    await permitirCms(this.auth, contexto.actorId, 'contenidos_registro', 'manage')
    const datos = normalizarCrearContenidoRegistro(entrada)
    const escritura = contextoEscrituraCms(contexto, this.reloj)
    return this.repo.crear(datos, escritura)
  }
}
