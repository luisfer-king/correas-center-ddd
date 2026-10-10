import { tipoDatoAtributo, type TipoDatoAtributo } from '../../../domain/valor-tecnico.js'
import type { RepositorioAtributosTecnicos } from '../../ports/repositorio-atributos-tecnicos.js'
import { exigirGestion, type AutorizacionCatalogo } from '../../acceso-catalogo.js'
import { idCatalogo, textoCatalogo, numeroDecimal } from '../../../domain/catalog-values.js'
import { Orden } from '../../../../../shared/domain/value-objects.js'
export class CrearAtributoTecnico {
  constructor(private readonly repositorio: RepositorioAtributosTecnicos, private readonly autorizar: AutorizacionCatalogo) {}
  async ejecutar(actor: string, datos: { tipoDato?: TipoDatoAtributo; tipoAtributoId: bigint; nombre: string; valores: { descripcion: string | null; valorNumerico: string | null; unidadMedida: string | null }; orden: number }) {
    await exigirGestion(this.autorizar, actor, 'atributos-tecnicos')
    const tipoDato = tipoDatoAtributo(datos.tipoDato ?? 'numero')
    if (tipoDato !== 'numero' && datos.valores.valorNumerico !== null) throw new Error('El atributo no admite valor numérico heredado')
    return this.repositorio.crear({ tipoDato, tipoAtributoId: idCatalogo(datos.tipoAtributoId), nombre: textoCatalogo(datos.nombre, 'Nombre'), valores: { ...datos.valores, valorNumerico: datos.valores.valorNumerico === null ? null : numeroDecimal(datos.valores.valorNumerico) }, orden: Orden.create(datos.orden) }, actor)
  }
}
