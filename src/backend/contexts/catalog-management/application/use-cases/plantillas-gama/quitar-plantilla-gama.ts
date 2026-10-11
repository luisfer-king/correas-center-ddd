import type { RepositorioPlantillasGama } from '../../ports/repositorio-plantillas-gama.js'
import { exigirGestion, type AutorizacionCatalogo } from '../../acceso-catalogo.js'
import { idGama } from '../../../domain/gama-values.js'
import { versionGama } from '../../gamas-aplicacion.js'
export class QuitarPlantillaGama {
  constructor(private readonly repo:RepositorioPlantillasGama,private readonly autorizar:AutorizacionCatalogo) {}
  async ejecutar(actor:string,productoId:bigint,version:Date) {
    await exigirGestion(this.autorizar,actor,'categorias')
    return this.repo.quitar(idGama(productoId),versionGama(version),actor)
  }
}
