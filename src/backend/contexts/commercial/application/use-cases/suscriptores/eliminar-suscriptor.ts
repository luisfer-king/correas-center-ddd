import type { RepositorioSuscriptores } from '../../ports/repositorio-suscriptores.js'
import { exigirGestion, type AutorizacionCrm } from '../../acceso-crm.js'
import { fechaCambioCrm, type RelojCrm } from '../../fecha-cambio-crm.js'

export class EliminarSuscriptor {
  constructor(private readonly repositorio: RepositorioSuscriptores, private readonly autorizar: AutorizacionCrm,
    private readonly reloj: RelojCrm) {}
  async ejecutar(actorId: string, id: bigint): Promise<void> {
    await exigirGestion(this.autorizar, actorId, 'suscriptores')
    const suscriptor = await this.repositorio.buscarPorId(id, false)
    if (!suscriptor) throw new Error('Suscriptor no disponible')
    const version = suscriptor.actualizadoEn
    suscriptor.eliminar(fechaCambioCrm(this.reloj, version))
    await this.repositorio.guardar(suscriptor, version, actorId)
  }
}
