import type { Marca } from '../../domain/marca.js'
import type { Slug, Orden } from '../../../../shared/domain/value-objects.js'

export type DatosNuevaMarca = { nombre: string; slug: Slug; logo: string | null; orden: Orden }

export interface RepositorioMarcas {
  buscarPorId(id: bigint, incluirEliminados: boolean): Promise<Marca | null>
  buscarPorSlug(slug: string, incluirEliminados: boolean): Promise<Marca | null>
  listar(pagina: number, incluirEliminados: boolean): Promise<readonly Marca[]>
  crear(datos: DatosNuevaMarca, actorId: string): Promise<Marca>
  guardar(registro: Marca, versionAnterior: Date, actorId: string): Promise<void>
}
