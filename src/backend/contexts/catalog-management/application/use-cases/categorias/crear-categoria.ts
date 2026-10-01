import { slugNombre } from '../../../../../../shared/slug-nombre.js'
import { Orden, Slug } from '../../../../../shared/domain/value-objects.js'
import { idCatalogo, textoCatalogo } from '../../../domain/catalog-values.js'
import { exigirGestion, type AutorizacionCatalogo } from '../../acceso-catalogo.js'
import type { RepositorioCategorias } from '../../ports/repositorio-categorias.js'
import type { RepositorioProductos } from '../../ports/repositorio-productos.js'
export class CrearCategoria {
  constructor(private readonly repositorio: RepositorioCategorias, private readonly autorizar: AutorizacionCatalogo, private readonly productos: RepositorioProductos) { }
  async ejecutar(actor: string, datos: { productoId: bigint; nombre: string; slug?: string; imagen: string | null; descripcion: string | null; descripcionCorta: string | null; uso: string | null; orden: number }) {
    await exigirGestion(this.autorizar, actor, 'categorias')
    const producto = await this.productos.buscarPorId(idCatalogo(datos.productoId), false)
    if (!producto || producto.estado !== 'activo') throw new Error('Referencia no disponible')
    const segmento = Slug.create(slugNombre(datos.nombre)).value
    return this.repositorio.crear({ productoId: idCatalogo(datos.productoId), nombre: textoCatalogo(datos.nombre, 'Nombre'), slug: Slug.rutaCategoria(`${producto.slug.value}/${segmento}`), imagen: datos.imagen, descripcion: datos.descripcion, descripcionCorta: datos.descripcionCorta, uso: datos.uso, orden: Orden.create(datos.orden) }, actor)
  }
}
