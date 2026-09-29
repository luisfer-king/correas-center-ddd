import type { RepositorioCategorias } from '../../ports/repositorio-categorias.js'
import { exigirGestion, type AutorizacionCatalogo } from '../../acceso-catalogo.js'
import { idCatalogo, textoCatalogo, numeroDecimal } from '../../../domain/catalog-values.js'
import { Orden, Slug } from '../../../../../shared/domain/value-objects.js'
export class CrearCategoria {
  constructor(private readonly repositorio: RepositorioCategorias, private readonly autorizar: AutorizacionCatalogo) {}
  async ejecutar(actor: string, datos: { productoId: bigint; nombre: string; slug: string; imagen: string | null; descripcion: string | null; descripcionCorta: string | null; uso: string | null; orden: number }) {
    await exigirGestion(this.autorizar, actor, 'categorias')
    return this.repositorio.crear({ productoId: idCatalogo(datos.productoId), nombre: textoCatalogo(datos.nombre, 'Nombre'), slug: Slug.create(datos.slug), imagen: datos.imagen, descripcion: datos.descripcion, descripcionCorta: datos.descripcionCorta, uso: datos.uso, orden: Orden.create(datos.orden) }, actor)
  }
}
