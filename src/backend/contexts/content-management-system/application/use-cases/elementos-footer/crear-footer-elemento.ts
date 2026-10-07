import type { RepositorioElementosFooter } from '../../ports/repositorio-footer-elemento.js'
import type { AutorizacionCms, ContextoAccionCms } from '../../seguridad-cms.js'
import { permitirCms } from '../../seguridad-cms.js'
import type { RelojCms } from '../../operaciones-cms.js'
import { contextoEscrituraCms } from '../../operaciones-cms.js'
import { normalizarCrearFooterElemento } from './datos-footer-elemento.js'
import type { DatosCrearFooterElemento } from './datos-footer-elemento.js'

export class CrearFooterElemento {
  constructor(private readonly repo: RepositorioElementosFooter, private readonly auth: AutorizacionCms, private readonly reloj: RelojCms) {}
  async ejecutar(contexto: ContextoAccionCms, entrada: DatosCrearFooterElemento) {
    await permitirCms(this.auth, contexto.actorId, 'elementos_footer', 'manage')
    const datos = normalizarCrearFooterElemento(entrada)
    const escritura = contextoEscrituraCms(contexto, this.reloj)
    return this.repo.crear(datos, escritura)
  }
}
