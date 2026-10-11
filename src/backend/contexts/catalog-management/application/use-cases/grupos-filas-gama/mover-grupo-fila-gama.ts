import type { UnidadTrabajoGamas } from '../../ports/unidad-trabajo-gamas.js'
import type { AutorizacionCatalogo } from '../../acceso-catalogo.js'
import { escribirGama, type EdicionGama, moverElemento } from '../../gamas-aplicacion.js'
export class MoverGrupoFilaGama {
  constructor(private readonly uow: UnidadTrabajoGamas, private readonly autorizar: AutorizacionCatalogo) {}
  ejecutar(actor:string,edicion:EdicionGama,id:bigint,posicion:number) {
    return escribirGama(this.uow,this.autorizar,actor,edicion,async s=>{const ids=moverElemento(await s.gruposFilas.listar(),id,posicion);await s.gruposFilas.reordenar(ids);return ids})
  }
}
