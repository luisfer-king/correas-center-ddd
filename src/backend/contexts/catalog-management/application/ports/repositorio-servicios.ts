import type { Servicio } from '../../domain/servicio.js'
import type { Orden } from '../../../../shared/domain/value-objects.js'

export type DatosNuevoServicio = { empresaId: bigint; nombre: string; descripcion: string | null; imagen: string | null; orden: Orden }

export interface RepositorioServicios {
  buscarPorId(id: bigint, incluirEliminados: boolean): Promise<Servicio | null>
  listar(pagina: number, incluirEliminados: boolean, empresaId?: bigint): Promise<readonly Servicio[]>
  crear(datos: DatosNuevoServicio, actorId: string): Promise<Servicio>
  guardar(registro: Servicio, versionAnterior: Date, actorId: string): Promise<void>
}
