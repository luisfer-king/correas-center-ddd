import type { RepositorioServicios } from '../../ports/repositorio-servicios.js'
import type { Servicio } from '../../../domain/servicio.js'
import { exigirLectura, puedeVerEliminados, type AutorizacionCatalogo } from '../../acceso-catalogo.js'
export class ObtenerServicio {
  constructor(private readonly repositorio: RepositorioServicios, private readonly autorizar: AutorizacionCatalogo) {}
  async ejecutar(actor: string, id: bigint): Promise<Servicio> {
    await exigirLectura(this.autorizar, actor, 'servicios')
    const registro = await this.repositorio.buscarPorId(id, await puedeVerEliminados(this.autorizar, actor))
    if (!registro) throw new Error('Registro no disponible')
    return registro
  }
}
