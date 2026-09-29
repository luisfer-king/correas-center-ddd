import type { AsignacionMarca } from '../../domain/asignacion-marca.js'
import type { Orden } from '../../../../shared/domain/value-objects.js'

export type DatosNuevaAsignacionMarca = { productoId: bigint; marcaId: bigint; orden: Orden | null }

export interface RepositorioAsignacionesMarca {
  buscarPorId(id: bigint, incluirEliminados: boolean): Promise<AsignacionMarca | null>
  buscarPorPar(productoId: bigint, marcaId: bigint, incluirEliminados: boolean): Promise<AsignacionMarca | null>
  listar(pagina: number, incluirEliminados: boolean, productoId: bigint): Promise<readonly AsignacionMarca[]>
  crear(datos: DatosNuevaAsignacionMarca, actorId: string): Promise<AsignacionMarca>
  guardar(registro: AsignacionMarca, versionAnterior: Date, actorId: string): Promise<void>
}
