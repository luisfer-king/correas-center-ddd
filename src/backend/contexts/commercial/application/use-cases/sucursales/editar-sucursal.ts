import type { RepositorioSucursales } from '../../ports/repositorio-sucursales.js'
import { exigirGestion, type AutorizacionCrm } from '../../acceso-crm.js'
import { fechaCambioCrm, type RelojCrm } from '../../fecha-cambio-crm.js'
import { prepararSucursal, type EntradaSucursal } from './crear-sucursal.js'

export class EditarSucursal {
  constructor(private readonly sucursales: RepositorioSucursales, private readonly autorizar: AutorizacionCrm,
    private readonly reloj: RelojCrm) {}
  async ejecutar(actorId: string, id: bigint, datos: Omit<EntradaSucursal, 'empresaId'>) {
    await exigirGestion(this.autorizar, actorId, 'sucursales')
    const sucursal = await this.sucursales.buscarPorId(id, false)
    if (!sucursal) throw new Error('Sucursal no disponible')
    if (datos.esPrincipal && sucursal.estado !== 'activo') throw new Error('Sucursal no activa')
    const entrada = prepararSucursal({ ...datos, empresaId: sucursal.empresaId })
    const version = sucursal.actualizadoEn
    const cuando = fechaCambioCrm(this.reloj, version)
    sucursal.editar(entrada.datos, cuando)
    sucursal.reordenar(entrada.orden, cuando)
    if (entrada.esPrincipal) sucursal.marcarPrincipal(cuando)
    else sucursal.quitarPrincipal(cuando)
    await this.sucursales.guardar(sucursal, version, actorId)
    return sucursal
  }
}
