import type { AsignacionIndustria, DestinoIndustria } from '../../domain/asignacion-industria.js'
import type { Orden } from '../../../../shared/domain/value-objects.js'

export type DatosNuevaAsignacionIndustria = { industriaId: bigint; destino: DestinoIndustria; orden: Orden }

export interface RepositorioAsignacionesIndustria {
  buscarPorId(id: bigint, incluirEliminados: boolean): Promise<AsignacionIndustria | null>
  buscarPorPar(industriaId: bigint, destino: DestinoIndustria, incluirEliminados: boolean): Promise<AsignacionIndustria | null>
  listar(pagina: number, incluirEliminados: boolean, industriaId: bigint): Promise<readonly AsignacionIndustria[]>
  crear(datos: DatosNuevaAsignacionIndustria, actorId: string): Promise<AsignacionIndustria>
  guardar(registro: AsignacionIndustria, versionAnterior: Date, actorId: string): Promise<void>
}
