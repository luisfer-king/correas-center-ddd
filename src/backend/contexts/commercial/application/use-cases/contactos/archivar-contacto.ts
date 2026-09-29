import type { RepositorioContactosEntrantes } from '../../ports/repositorio-contactos-entrantes.js'
import { exigirGestion, type AutorizacionCrm } from '../../acceso-crm.js'
import { fechaCambioCrm, type RelojCrm } from '../../fecha-cambio-crm.js'

export class ArchivarContacto {
  constructor(private readonly repositorio: RepositorioContactosEntrantes, private readonly autorizar: AutorizacionCrm,
    private readonly reloj: RelojCrm) {}
  async ejecutar(actorId: string, id: bigint): Promise<void> {
    await exigirGestion(this.autorizar, actorId, 'contactos')
    const contacto = await this.repositorio.buscarPorId(id, false)
    if (!contacto) throw new Error('Contacto no disponible')
    const version = contacto.actualizadoEn
    contacto.archivar(fechaCambioCrm(this.reloj, version))
    await this.repositorio.guardar(contacto, version, actorId)
  }
}
