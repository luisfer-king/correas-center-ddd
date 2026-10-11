import type { UnidadTrabajoGamas } from '../../ports/unidad-trabajo-gamas.js'
import type { AutorizacionCatalogo } from '../../acceso-catalogo.js'
import { escribirGama, type EdicionGama, encontrarElemento } from '../../gamas-aplicacion.js'
export class ActivarFilaGama {
  constructor(private readonly uow: UnidadTrabajoGamas, private readonly autorizar: AutorizacionCatalogo) {}
  ejecutar(actor:string,edicion:EdicionGama,id:bigint) {
    return escribirGama(this.uow,this.autorizar,actor,edicion,async s=>{const e=encontrarElemento(await s.filas.listar(),id);e.activar(s.cuando);await s.filas.guardar(e);return e.id})
  }
}
