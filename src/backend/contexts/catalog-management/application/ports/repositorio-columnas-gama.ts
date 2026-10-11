import type { ColumnaGama } from '../../domain/columna-gama.js'
import type { TipoDatoAtributo } from '../../domain/valor-tecnico.js'
export type DatosNuevaColumnaGama = { atributoId: bigint; tipoDato: TipoDatoAtributo; grupoId: bigint | null; etiqueta: string | null; unidadMedida: string | null }
/** Solo disponible dentro de UnidadTrabajoGamas; todas las operaciones pertenecen a su gama. */
export interface RepositorioColumnasGama {
  listar(incluirEliminados?: boolean): Promise<readonly ColumnaGama[]>
  crear(datos: DatosNuevaColumnaGama): Promise<ColumnaGama>
  guardar(entidad: ColumnaGama): Promise<void>
  /** Permutación completa de los IDs no eliminados. Asigna posiciones 1..N. */
  reordenar(ids: readonly bigint[]): Promise<void>
}
