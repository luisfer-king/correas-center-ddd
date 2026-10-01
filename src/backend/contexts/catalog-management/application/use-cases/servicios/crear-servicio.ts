import type { RepositorioServicios } from '../../ports/repositorio-servicios.js'
import { exigirGestion, type AutorizacionCatalogo } from '../../acceso-catalogo.js'
import { idCatalogo, textoCatalogo, numeroDecimal } from '../../../domain/catalog-values.js'
import { Orden, Slug } from '../../../../../shared/domain/value-objects.js'
export class CrearServicio {
  constructor(private readonly repositorio: RepositorioServicios, private readonly autorizar: AutorizacionCatalogo) {}
  async ejecutar(actor: string, datos: { empresaId: bigint; nombre: string; descripcion: string | null; imagen: string | null; orden: number }) {
    await exigirGestion(this.autorizar, actor, 'servicios')
    return this.repositorio.crear({ empresaId: idCatalogo(datos.empresaId), nombre: textoCatalogo(datos.nombre, 'Nombre'), descripcion: datos.descripcion, imagen: datos.imagen, orden: Orden.create(datos.orden) }, actor)
  }
}
