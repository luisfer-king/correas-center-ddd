import type { GamaCategoria, EstructuraGama } from '../../domain/gama-categoria.js'
export type GamaCompleta = Readonly<{ gama: GamaCategoria; estructura: EstructuraGama }>
export type DatosNuevaGama = { categoriaId: bigint; titulo: string; descripcion: string | null; imagen: string | null; gamaOrigenId?: bigint | null }
/** Lecturas internas. La capa de aplicación debe exigir permiso y visibilidad de eliminados. */
export interface RepositorioGamas {
  buscarPorId(id: bigint, incluirEliminados?: boolean): Promise<GamaCompleta | null>
  buscarPorCategoria(categoriaId: bigint, incluirEliminados?: boolean): Promise<GamaCompleta | null>
  listarPorProducto(productoId: bigint, pagina?: number, incluirEliminados?: boolean): Promise<readonly GamaCategoria[]>
}
