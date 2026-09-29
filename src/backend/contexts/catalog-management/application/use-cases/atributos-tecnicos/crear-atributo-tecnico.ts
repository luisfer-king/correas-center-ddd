import type { RepositorioAtributosTecnicos } from '../../ports/repositorio-atributos-tecnicos.js'
import { exigirGestion, type AutorizacionCatalogo } from '../../acceso-catalogo.js'
import { idCatalogo, textoCatalogo, numeroDecimal } from '../../../domain/catalog-values.js'
import { Orden, Slug } from '../../../../../shared/domain/value-objects.js'
export class CrearAtributoTecnico {
  constructor(private readonly repositorio: RepositorioAtributosTecnicos, private readonly autorizar: AutorizacionCatalogo) {}
  async ejecutar(actor: string, datos: { tipoAtributoId: bigint; nombre: string; valores: { descripcion: string | null; valorNumerico: string | null; unidadMedida: string | null }; orden: number }) {
    await exigirGestion(this.autorizar, actor, 'atributos-tecnicos')
    return this.repositorio.crear({ tipoAtributoId: idCatalogo(datos.tipoAtributoId), nombre: textoCatalogo(datos.nombre, 'Nombre'), valores: { ...datos.valores, valorNumerico: datos.valores.valorNumerico === null ? null : numeroDecimal(datos.valores.valorNumerico) }, orden: Orden.create(datos.orden) }, actor)
  }
}
