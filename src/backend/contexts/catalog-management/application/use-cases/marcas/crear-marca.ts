import type { RepositorioMarcas } from '../../ports/repositorio-marcas.js'
import { exigirGestion, type AutorizacionCatalogo } from '../../acceso-catalogo.js'
import { idCatalogo, textoCatalogo, numeroDecimal } from '../../../domain/catalog-values.js'
import { Orden, Slug } from '../../../../../shared/domain/value-objects.js'
export class CrearMarca {
  constructor(private readonly repositorio: RepositorioMarcas, private readonly autorizar: AutorizacionCatalogo) {}
  async ejecutar(actor: string, datos: { nombre: string; slug: string; logo: string | null; orden: number }) {
    await exigirGestion(this.autorizar, actor, 'marcas')
    return this.repositorio.crear({ nombre: textoCatalogo(datos.nombre, 'Nombre'), slug: Slug.create(datos.slug), logo: datos.logo, orden: Orden.create(datos.orden) }, actor)
  }
}
