import type { ValorGama } from '../../domain/valor-gama.js'
import type { ValorTecnico } from '../../domain/valor-tecnico.js'
export interface RepositorioValoresGama {
  listar(): Promise<readonly ValorGama[]>
  poner(filaId: bigint, columnaId: bigint, valor: ValorTecnico): Promise<ValorGama>
  quitar(filaId: bigint, columnaId: bigint): Promise<void>
}
