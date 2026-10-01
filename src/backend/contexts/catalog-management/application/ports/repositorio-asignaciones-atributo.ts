import type { AsignacionAtributo } from '../../domain/asignacion-atributo.js'
import type { Orden } from '../../../../shared/domain/value-objects.js'

export type DatosNuevaAsignacionAtributo = { categoriaId: bigint; atributoId: bigint; valorPersonalizado: string | null; orden: Orden }

export interface RepositorioAsignacionesAtributo {
  buscarPorId(id: bigint, incluirEliminados: boolean): Promise<AsignacionAtributo | null>
  buscarPorPar(categoriaId: bigint, atributoId: bigint, incluirEliminados: boolean): Promise<AsignacionAtributo | null>
  listar(pagina: number, incluirEliminados: boolean, categoriaId: bigint): Promise<readonly AsignacionAtributo[]>
  crear(datos: DatosNuevaAsignacionAtributo, actorId: string): Promise<AsignacionAtributo>
  guardar(registro: AsignacionAtributo, versionAnterior: Date, actorId: string): Promise<void>
}
