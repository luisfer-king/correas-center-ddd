import type { UnidadTrabajoGamas } from '../../ports/unidad-trabajo-gamas.js'
import type { AutorizacionCatalogo } from '../../acceso-catalogo.js'
import { escribirGama, type EdicionGama, encontrarElemento } from '../../gamas-aplicacion.js'
export class EliminarGrupoFilaGama {
  constructor(private readonly uow: UnidadTrabajoGamas, private readonly autorizar: AutorizacionCatalogo) {}
  ejecutar(actor:string,edicion:EdicionGama,id:bigint) {
    return escribirGama(this.uow,this.autorizar,actor,edicion,async s=>{const e=encontrarElemento(await s.gruposFilas.listar(),id);e.eliminar(s.cuando);await s.gruposFilas.guardar(e);await s.gruposFilas.reordenar((await s.gruposFilas.listar()).map(v=>v.id));return e.id})
  }
}
