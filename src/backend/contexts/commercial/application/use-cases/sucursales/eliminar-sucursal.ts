import type { RepositorioSucursales } from '../../ports/repositorio-sucursales.js'
import { exigirGestion, type AutorizacionCrm } from '../../acceso-crm.js'
import { fechaCambioCrm, type RelojCrm } from '../../fecha-cambio-crm.js'

export class EliminarSucursal {
  constructor(private readonly repositorio: RepositorioSucursales, private readonly autorizar: AutorizacionCrm,
    private readonly reloj: RelojCrm) {}
  async ejecutar(actorId: string, id: bigint): Promise<void> {
    await exigirGestion(this.autorizar, actorId, 'sucursales')
    const sucursal = await this.repositorio.buscarPorId(id, false)
    if (!sucursal) throw new Error('Sucursal no disponible')
    const version = sucursal.actualizadoEn
    sucursal.eliminar(fechaCambioCrm(this.reloj, version))
    await this.repositorio.guardar(sucursal, version, actorId)
  }
}
