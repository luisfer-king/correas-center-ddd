import type { Sucursal } from '../../../domain/sucursal.js'
import type { RepositorioSucursales } from '../../ports/repositorio-sucursales.js'
import { exigirLectura, puedeVerEliminados, type AutorizacionCrm } from '../../acceso-crm.js'

export class ObtenerSucursal {
  constructor(private readonly repositorio: RepositorioSucursales, private readonly autorizar: AutorizacionCrm) {}
  async ejecutar(actorId: string, id: bigint): Promise<Sucursal> {
    await exigirLectura(this.autorizar, actorId, 'sucursales')
    const sucursal = await this.repositorio.buscarPorId(id, await puedeVerEliminados(this.autorizar, actorId))
    if (!sucursal) throw new Error('Sucursal no disponible')
    return sucursal
  }
}
