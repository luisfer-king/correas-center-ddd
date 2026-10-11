import type { RepositorioGamas } from '../../ports/repositorio-gamas.js'
import type { UnidadTrabajoGamas } from '../../ports/unidad-trabajo-gamas.js'
import { exigirGestion, type AutorizacionCatalogo } from '../../acceso-catalogo.js'
import { copiarEstructuraGama, validarOpcionesCopia, type OpcionesCopiaGama } from '../../copiar-estructura-gama.js'
import { versionGama } from '../../gamas-aplicacion.js'
import { idGama } from '../../../domain/gama-values.js'
export type DatosCopiarGama = OpcionesCopiaGama & {categoriaId:bigint;origenId:bigint;versionOrigen:Date;titulo?:string}
export class CopiarGamaCategoria {
  constructor(private readonly gamas:RepositorioGamas,private readonly uow:UnidadTrabajoGamas,private readonly autorizar:AutorizacionCatalogo) {}
  async ejecutar(actor:string,d:DatosCopiarGama) {
    await exigirGestion(this.autorizar,actor,'categorias')
    const opciones=validarOpcionesCopia(d),categoriaId=idGama(d.categoriaId),origenId=idGama(d.origenId),version=versionGama(d.versionOrigen)
    const origen=await this.gamas.buscarPorId(origenId)
    if (!origen || origen.gama.estado!=='activo') throw new Error('Gama origen no disponible')
    if (origen.gama.categoriaId===categoriaId) throw new Error('No se puede copiar una gama sobre su categoría')
    if (origen.gama.actualizadoEn.getTime()!==version.getTime()) throw new Error('Origen modificado; vuelve a cargar la plantilla')
    return this.uow.crear({categoriaId,titulo:d.titulo??origen.gama.titulo,descripcion:origen.gama.descripcion,imagen:origen.gama.imagen,gamaOrigenId:origenId},actor,s=>copiarEstructuraGama(s,opciones),{asegurarPrimeraPlantilla:true,origen:{gamaId:origenId,version}})
  }
}
