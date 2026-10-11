import type { GrupoFilaGama } from '../../domain/grupo-fila-gama.js'
export type DatosNuevaGrupoFilaGama = { codigo: string; nombre: string }
/** Solo disponible dentro de UnidadTrabajoGamas; todas las operaciones pertenecen a su gama. */
export interface RepositorioGruposFilasGama {
  listar(incluirEliminados?: boolean): Promise<readonly GrupoFilaGama[]>
  crear(datos: DatosNuevaGrupoFilaGama): Promise<GrupoFilaGama>
  guardar(entidad: GrupoFilaGama): Promise<void>
  /** Permutación completa de los IDs no eliminados. Asigna posiciones 1..N. */
  reordenar(ids: readonly bigint[]): Promise<void>
}
