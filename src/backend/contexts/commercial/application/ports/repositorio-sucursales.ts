import type { Orden } from '../../../../shared/domain/value-objects.js'
import type { DatosSucursal, Sucursal } from '../../domain/sucursal.js'

export type DatosNuevaSucursal = {
    empresaId: bigint
    datos: DatosSucursal
    esPrincipal: boolean
    ordenAutomatico?: boolean
    orden: Orden
}

export interface RepositorioSucursales {
    buscarPorId(id: bigint, incluirEliminados: boolean): Promise<Sucursal | null>
    listar(pagina: number, incluirEliminados: boolean): Promise<readonly Sucursal[]>
    listarPorEmpresa(empresaId: bigint, incluirEliminados: boolean): Promise<readonly Sucursal[]>
    crear(datos: DatosNuevaSucursal, actorId: string): Promise<Sucursal>
    /** Si esPrincipal es true, desmarca las otras sucursales en la misma transacción. */
    guardar(sucursal: Sucursal, versionAnterior: Date, actorId: string): Promise<void>
}
