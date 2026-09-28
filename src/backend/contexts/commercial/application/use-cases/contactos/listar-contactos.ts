import type { ContactoEntrante } from '../../../domain/contacto-entrante.js'
import type { RepositorioContactosEntrantes } from '../../ports/repositorio-contactos-entrantes.js'
import { exigirLectura, puedeVerEliminados, type AutorizacionCrm } from '../../acceso-crm.js'

export class ListarContactosEntrantes {
  constructor(private readonly repositorio: RepositorioContactosEntrantes, private readonly autorizar: AutorizacionCrm) {}
  async ejecutar(actorId: string, pagina = 1): Promise<readonly ContactoEntrante[]> {
    await exigirLectura(this.autorizar, actorId, 'contactos')
    return this.repositorio.listar(pagina, await puedeVerEliminados(this.autorizar, actorId))
  }
}
