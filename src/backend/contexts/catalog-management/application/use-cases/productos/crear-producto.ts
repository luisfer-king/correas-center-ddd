import { slugNombre } from '../../../../../../shared/slug-nombre.js'
import { Orden, Slug } from '../../../../../shared/domain/value-objects.js'
import { idCatalogo, textoCatalogo } from '../../../domain/catalog-values.js'
import { exigirGestion, type AutorizacionCatalogo } from '../../acceso-catalogo.js'
import type { RepositorioProductos } from '../../ports/repositorio-productos.js'
export class CrearProducto {
  constructor(private readonly repositorio: RepositorioProductos, private readonly autorizar: AutorizacionCatalogo) { }
  async ejecutar(actor: string, datos: { empresaId: bigint; nombre: string; slug?: string; imagen: string | null; orden: number }) {
    await exigirGestion(this.autorizar, actor, 'productos')
    return this.repositorio.crear({ empresaId: idCatalogo(datos.empresaId), nombre: textoCatalogo(datos.nombre, 'Nombre'), slug: Slug.create(slugNombre(datos.nombre)), imagen: datos.imagen, orden: Orden.create(datos.orden) }, actor)
  }
}
