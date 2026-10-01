import type { RepositorioAsignacionesIndustria } from '../../ports/repositorio-asignaciones-industria.js'
import { exigirGestion, type AutorizacionCatalogo } from '../../acceso-catalogo.js'
import { idCatalogo, textoCatalogo, numeroDecimal } from '../../../domain/catalog-values.js'
import { Orden, Slug } from '../../../../../shared/domain/value-objects.js'
export class CrearAsignacionIndustria {
  constructor(private readonly repositorio: RepositorioAsignacionesIndustria, private readonly autorizar: AutorizacionCatalogo) {}
  async ejecutar(actor: string, datos: { industriaId: bigint; destino: { tipo: "categoria" | "servicio"; id: bigint }; orden: number }) {
    await exigirGestion(this.autorizar, actor, 'asignaciones-industria')
    return this.repositorio.crear({ industriaId: idCatalogo(datos.industriaId), destino: { tipo: datos.destino.tipo, id: idCatalogo(datos.destino.id) }, orden: Orden.create(datos.orden) }, actor)
  }
}
