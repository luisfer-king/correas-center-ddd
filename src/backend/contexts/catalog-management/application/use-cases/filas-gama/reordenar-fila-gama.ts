import type { UnidadTrabajoGamas } from '../../ports/unidad-trabajo-gamas.js'
import type { AutorizacionCatalogo } from '../../acceso-catalogo.js'
import { escribirGama, type EdicionGama } from '../../gamas-aplicacion.js'
export class ReordenarFilaGama {
  constructor(private readonly uow: UnidadTrabajoGamas, private readonly autorizar: AutorizacionCatalogo) {}
  ejecutar(actor:string,edicion:EdicionGama,ids:readonly bigint[]) {
    return escribirGama(this.uow,this.autorizar,actor,edicion,async s=>{await s.filas.reordenar(ids);return [...ids]})
  }
}
