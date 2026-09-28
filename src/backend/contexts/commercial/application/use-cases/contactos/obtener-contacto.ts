import type { ContactoEntrante } from '../../../domain/contacto-entrante.js'
import type { RepositorioContactosEntrantes } from '../../ports/repositorio-contactos-entrantes.js'
import { exigirLectura, puedeVerEliminados, type AutorizacionCrm } from '../../acceso-crm.js'

export class ObtenerContacto {
  constructor(private readonly repositorio: RepositorioContactosEntrantes, private readonly autorizar: AutorizacionCrm) {}
  async ejecutar(actorId: string, id: bigint): Promise<ContactoEntrante> {
    await exigirLectura(this.autorizar, actorId, 'contactos')
    const contacto = await this.repositorio.buscarPorId(id, await puedeVerEliminados(this.autorizar, actorId))
    if (!contacto) throw new Error('Contacto no disponible')
    return contacto
  }
}
