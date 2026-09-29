import type { RepositorioAsignacionesMarca } from '../../ports/repositorio-asignaciones-marca.js'
import { exigirGestion, type AutorizacionCatalogo } from '../../acceso-catalogo.js'
import { idCatalogo, textoCatalogo, numeroDecimal } from '../../../domain/catalog-values.js'
import { Orden, Slug } from '../../../../../shared/domain/value-objects.js'
export class CrearAsignacionMarca {
  constructor(private readonly repositorio: RepositorioAsignacionesMarca, private readonly autorizar: AutorizacionCatalogo) {}
  async ejecutar(actor: string, datos: { productoId: bigint; marcaId: bigint; orden: number | null }) {
    await exigirGestion(this.autorizar, actor, 'asignaciones-marca')
    return this.repositorio.crear({ productoId: idCatalogo(datos.productoId), marcaId: idCatalogo(datos.marcaId), orden: datos.orden === null ? null : Orden.create(datos.orden) }, actor)
  }
}
