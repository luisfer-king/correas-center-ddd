import type { FilaGama } from '../../domain/fila-gama.js'
export type DatosNuevaFilaGama = { codigo: string; grupoId: bigint | null; nombre: string; descripcion: string | null; enlaceDetalle: string | null }
/** Solo disponible dentro de UnidadTrabajoGamas; todas las operaciones pertenecen a su gama. */
export interface RepositorioFilasGama {
  listar(incluirEliminados?: boolean): Promise<readonly FilaGama[]>
  crear(datos: DatosNuevaFilaGama): Promise<FilaGama>
  guardar(entidad: FilaGama): Promise<void>
  /** Permutación completa de los IDs no eliminados. Asigna posiciones 1..N. */
  reordenar(ids: readonly bigint[]): Promise<void>
}
