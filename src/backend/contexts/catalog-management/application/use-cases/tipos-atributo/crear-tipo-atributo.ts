import type { RepositorioTiposAtributo } from '../../ports/repositorio-tipos-atributo.js'
import { exigirGestion, type AutorizacionCatalogo } from '../../acceso-catalogo.js'
import { idCatalogo, textoCatalogo, numeroDecimal } from '../../../domain/catalog-values.js'
import { Orden, Slug } from '../../../../../shared/domain/value-objects.js'
export class CrearTipoAtributo {
  constructor(private readonly repositorio: RepositorioTiposAtributo, private readonly autorizar: AutorizacionCatalogo) {}
  async ejecutar(actor: string, datos: { nombre: string; slug: string; descripcion: string | null; icono: string | null; capacidades: { descripcion: boolean; numero: boolean; unidad: boolean }; orden: number }) {
    await exigirGestion(this.autorizar, actor, 'tipos-atributo')
    return this.repositorio.crear({ nombre: textoCatalogo(datos.nombre, 'Nombre'), slug: Slug.create(datos.slug), descripcion: datos.descripcion, icono: datos.icono, capacidades: datos.capacidades, orden: Orden.create(datos.orden) }, actor)
  }
}
