import type { UnidadTrabajoGamas } from '../../ports/unidad-trabajo-gamas.js'
import { exigirGestion, type AutorizacionCatalogo } from '../../acceso-catalogo.js'
import { idGama } from '../../../domain/gama-values.js'
export type DatosCrearGama = { categoriaId: bigint; titulo: string; descripcion?: string | null; imagen?: string | null }
export class CrearGamaCategoria {
  constructor(private readonly uow: UnidadTrabajoGamas,private readonly autorizar: AutorizacionCatalogo) {}
  async ejecutar(actor:string,d:DatosCrearGama) {
    await exigirGestion(this.autorizar,actor,'categorias')
    return this.uow.crear({categoriaId:idGama(d.categoriaId),titulo:d.titulo,descripcion:d.descripcion??null,imagen:d.imagen??null},actor,async s=>s.gama.id,{asegurarPrimeraPlantilla:true})
  }
}
