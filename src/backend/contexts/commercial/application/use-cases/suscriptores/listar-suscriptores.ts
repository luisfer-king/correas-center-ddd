import type { Suscriptor } from '../../../domain/suscriptor.js'
import type { RepositorioSuscriptores } from '../../ports/repositorio-suscriptores.js'
import { exigirLectura, puedeVerEliminados, type AutorizacionCrm } from '../../acceso-crm.js'

export class ListarSuscriptores {
  constructor(private readonly repositorio: RepositorioSuscriptores, private readonly autorizar: AutorizacionCrm) {}
  async ejecutar(actorId: string, pagina = 1): Promise<readonly Suscriptor[]> {
    await exigirLectura(this.autorizar, actorId, 'suscriptores')
    return this.repositorio.listar(pagina, await puedeVerEliminados(this.autorizar, actorId))
  }
}
