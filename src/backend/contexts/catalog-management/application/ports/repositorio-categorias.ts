import type { Categoria } from '../../domain/categoria.js'
import type { Slug, Orden } from '../../../../shared/domain/value-objects.js'

export type DatosNuevaCategoria = { productoId: bigint; nombre: string; slug: Slug; imagen: string | null; descripcion: string | null; descripcionCorta: string | null; uso: string | null; orden: Orden }

export interface RepositorioCategorias {
  buscarPorId(id: bigint, incluirEliminados: boolean): Promise<Categoria | null>
  buscarPorSlug(slug: string, incluirEliminados: boolean): Promise<Categoria | null>
  listar(pagina: number, incluirEliminados: boolean, productoId?: bigint): Promise<readonly Categoria[]>
  crear(datos: DatosNuevaCategoria, actorId: string): Promise<Categoria>
  guardar(registro: Categoria, versionAnterior: Date, actorId: string): Promise<void>
}
