import type { Sucursal } from '../../../domain/sucursal.js'
import type { RepositorioSucursales } from '../../ports/repositorio-sucursales.js'
import { exigirLectura, puedeVerEliminados, type AutorizacionCrm } from '../../acceso-crm.js'

export class ListarSucursales {
  constructor(private readonly repositorio: RepositorioSucursales, private readonly autorizar: AutorizacionCrm) {}
  async ejecutar(actorId: string, pagina = 1): Promise<readonly Sucursal[]> {
    await exigirLectura(this.autorizar, actorId, 'sucursales')
    return this.repositorio.listar(pagina, await puedeVerEliminados(this.autorizar, actorId))
  }
}
