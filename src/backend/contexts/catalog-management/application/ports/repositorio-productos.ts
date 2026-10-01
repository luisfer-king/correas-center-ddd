import type { Producto } from '../../domain/producto.js'
import type { Slug, Orden } from '../../../../shared/domain/value-objects.js'

export type DatosNuevoProducto = { empresaId: bigint; nombre: string; slug: Slug; imagen: string | null; orden: Orden }

export interface RepositorioProductos {
  buscarPorId(id: bigint, incluirEliminados: boolean): Promise<Producto | null>
  buscarPorSlug(slug: string, incluirEliminados: boolean): Promise<Producto | null>
  listar(pagina: number, incluirEliminados: boolean, empresaId?: bigint): Promise<readonly Producto[]>
  crear(datos: DatosNuevoProducto, actorId: string): Promise<Producto>
  guardar(registro: Producto, versionAnterior: Date, actorId: string): Promise<void>
}
