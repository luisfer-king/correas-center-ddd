import type { Industria } from '../../domain/industria.js'
import type { Slug, Orden } from '../../../../shared/domain/value-objects.js'

export type DatosNuevaIndustria = { empresaId: bigint; nombre: string; slug: Slug; imagen: string | null; orden: Orden }

export interface RepositorioIndustrias {
  buscarPorId(id: bigint, incluirEliminados: boolean): Promise<Industria | null>
  buscarPorSlug(slug: string, incluirEliminados: boolean): Promise<Industria | null>
  listar(pagina: number, incluirEliminados: boolean, empresaId?: bigint): Promise<readonly Industria[]>
  crear(datos: DatosNuevaIndustria, actorId: string): Promise<Industria>
  guardar(registro: Industria, versionAnterior: Date, actorId: string): Promise<void>
}
