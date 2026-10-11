import type { RepositorioPlantillasGama } from '../../ports/repositorio-plantillas-gama.js'
import { exigirGestion, type AutorizacionCatalogo } from '../../acceso-catalogo.js'
import { idGama } from '../../../domain/gama-values.js'
import { versionGama } from '../../gamas-aplicacion.js'
export class SeleccionarPlantillaGama {
  constructor(private readonly repo:RepositorioPlantillasGama,private readonly autorizar:AutorizacionCatalogo) {}
  async ejecutar(actor:string,productoId:bigint,gamaId:bigint,version:Date|null) {
    await exigirGestion(this.autorizar,actor,'categorias')
    return this.repo.seleccionar(idGama(productoId),idGama(gamaId),version===null?null:versionGama(version),actor)
  }
}
