import type { UnidadTrabajoGamas } from '../../ports/unidad-trabajo-gamas.js'
import type { AutorizacionCatalogo } from '../../acceso-catalogo.js'
import { escribirGama, type EdicionGama, moverElemento } from '../../gamas-aplicacion.js'
export class MoverColumnaGama {
  constructor(private readonly uow: UnidadTrabajoGamas, private readonly autorizar: AutorizacionCatalogo) {}
  ejecutar(actor:string,edicion:EdicionGama,id:bigint,posicion:number) {
    return escribirGama(this.uow,this.autorizar,actor,edicion,async s=>{const ids=moverElemento(await s.columnas.listar(),id,posicion);await s.columnas.reordenar(ids);return ids})
  }
}
