import type { GrupoColumnaGama } from '../../domain/grupo-columna-gama.js'
export type DatosNuevaGrupoColumnaGama = { codigo: string; nombre: string }
/** Solo disponible dentro de UnidadTrabajoGamas; todas las operaciones pertenecen a su gama. */
export interface RepositorioGruposColumnasGama {
  listar(incluirEliminados?: boolean): Promise<readonly GrupoColumnaGama[]>
  crear(datos: DatosNuevaGrupoColumnaGama): Promise<GrupoColumnaGama>
  guardar(entidad: GrupoColumnaGama): Promise<void>
  /** Permutación completa de los IDs no eliminados. Asigna posiciones 1..N. */
  reordenar(ids: readonly bigint[]): Promise<void>
}
