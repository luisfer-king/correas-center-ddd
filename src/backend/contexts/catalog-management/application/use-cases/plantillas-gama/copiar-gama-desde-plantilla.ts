import type { RepositorioCategorias } from '../../ports/repositorio-categorias.js'
import type { RepositorioPlantillasGama } from '../../ports/repositorio-plantillas-gama.js'
import type { RepositorioGamas } from '../../ports/repositorio-gamas.js'
import type { UnidadTrabajoGamas } from '../../ports/unidad-trabajo-gamas.js'
import { exigirGestion, type AutorizacionCatalogo } from '../../acceso-catalogo.js'
import { copiarEstructuraGama, validarOpcionesCopia, type OpcionesCopiaGama } from '../../copiar-estructura-gama.js'
import { idGama } from '../../../domain/gama-values.js'
export class CopiarGamaDesdePlantilla {
  constructor(private readonly categorias:RepositorioCategorias,private readonly plantillas:RepositorioPlantillasGama,private readonly gamas:RepositorioGamas,private readonly uow:UnidadTrabajoGamas,private readonly autorizar:AutorizacionCatalogo) {}
  async ejecutar(actor:string,categoriaId:bigint,d:OpcionesCopiaGama & {titulo?:string}={}) {
    await exigirGestion(this.autorizar,actor,'categorias')
    const opciones=validarOpcionesCopia(d)
    const categoria=await this.categorias.buscarPorId(idGama(categoriaId),false)
    if (!categoria || categoria.estado!=='activo') throw new Error('Categoría no disponible')
    const plantilla=await this.plantillas.buscarPorProducto(categoria.productoId)
    if (!plantilla) throw new Error('El producto no tiene plantilla de gama')
    const origen=await this.gamas.buscarPorId(plantilla.gamaId)
    if (!origen || origen.gama.estado!=='activo') throw new Error('Plantilla no disponible')
    if (origen.gama.categoriaId===categoriaId) throw new Error('No se puede copiar una gama sobre su categoría')
    return this.uow.crear({categoriaId,titulo:d.titulo??origen.gama.titulo,descripcion:origen.gama.descripcion,imagen:origen.gama.imagen,gamaOrigenId:origen.gama.id},actor,s=>copiarEstructuraGama(s,opciones),{
      asegurarPrimeraPlantilla:true,origen:{gamaId:origen.gama.id,version:origen.gama.actualizadoEn,versionPlantilla:plantilla.actualizadoEn},
    })
  }
}
