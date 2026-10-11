import type { GamaCategoria } from '../../domain/gama-categoria.js'
import type { DatosNuevaGama, GamaCompleta } from './repositorio-gamas.js'
import type { RepositorioGruposColumnasGama } from './repositorio-grupos-columnas-gama.js'
import type { RepositorioGruposFilasGama } from './repositorio-grupos-filas-gama.js'
import type { RepositorioColumnasGama } from './repositorio-columnas-gama.js'
import type { RepositorioFilasGama } from './repositorio-filas-gama.js'
import type { RepositorioValoresGama } from './repositorio-valores-gama.js'
export type SesionGama = Readonly<{
  gama: GamaCategoria; cuando: Date; origen?: GamaCompleta | null
  gruposColumnas: RepositorioGruposColumnasGama; gruposFilas: RepositorioGruposFilasGama
  columnas: RepositorioColumnasGama; filas: RepositorioFilasGama; valores: RepositorioValoresGama
}>
export type ResultadoEscrituraGama<T> = { gamaId: bigint; version: Date; resultado: T }
export type OpcionesEscrituraGama = {
  asegurarPrimeraPlantilla?: boolean
  origen?: { gamaId: bigint; version: Date; versionPlantilla?: Date }
}
export interface UnidadTrabajoGamas {
  crear<T>(datos: DatosNuevaGama, actorId: string, trabajo: (sesion: SesionGama) => Promise<T>, opciones?: OpcionesEscrituraGama): Promise<ResultadoEscrituraGama<T>>
  editar<T>(gamaId: bigint, versionAnterior: Date, actorId: string, trabajo: (sesion: SesionGama) => Promise<T>, opciones?: OpcionesEscrituraGama): Promise<ResultadoEscrituraGama<T>>
}
