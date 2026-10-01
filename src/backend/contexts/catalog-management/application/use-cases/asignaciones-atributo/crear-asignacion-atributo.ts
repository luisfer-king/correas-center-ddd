import type { RepositorioAsignacionesAtributo } from '../../ports/repositorio-asignaciones-atributo.js'
import { exigirGestion, type AutorizacionCatalogo } from '../../acceso-catalogo.js'
import { idCatalogo, textoCatalogo, numeroDecimal } from '../../../domain/catalog-values.js'
import { Orden, Slug } from '../../../../../shared/domain/value-objects.js'
export class CrearAsignacionAtributo {
  constructor(private readonly repositorio: RepositorioAsignacionesAtributo, private readonly autorizar: AutorizacionCatalogo) {}
  async ejecutar(actor: string, datos: { categoriaId: bigint; atributoId: bigint; valorPersonalizado: string | null; orden: number }) {
    await exigirGestion(this.autorizar, actor, 'asignaciones-atributo')
    return this.repositorio.crear({ categoriaId: idCatalogo(datos.categoriaId), atributoId: idCatalogo(datos.atributoId), valorPersonalizado: datos.valorPersonalizado === null ? null : numeroDecimal(datos.valorPersonalizado), orden: Orden.create(datos.orden) }, actor)
  }
}
