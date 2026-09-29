import type { Suscriptor } from '../../../domain/suscriptor.js'
import type { RepositorioSuscriptores } from '../../ports/repositorio-suscriptores.js'
import { exigirLectura, puedeVerEliminados, type AutorizacionCrm } from '../../acceso-crm.js'

export class ObtenerSuscriptor {
  constructor(private readonly repositorio: RepositorioSuscriptores, private readonly autorizar: AutorizacionCrm) {}
  async ejecutar(actorId: string, id: bigint): Promise<Suscriptor> {
    await exigirLectura(this.autorizar, actorId, 'suscriptores')
    const suscriptor = await this.repositorio.buscarPorId(id, await puedeVerEliminados(this.autorizar, actorId))
    if (!suscriptor) throw new Error('Suscriptor no disponible')
    return suscriptor
  }
}
