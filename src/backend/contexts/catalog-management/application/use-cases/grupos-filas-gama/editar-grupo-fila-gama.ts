import type { UnidadTrabajoGamas } from '../../ports/unidad-trabajo-gamas.js'
import type { AutorizacionCatalogo } from '../../acceso-catalogo.js'
import { escribirGama, type EdicionGama, encontrarElemento } from '../../gamas-aplicacion.js'
export class EditarGrupoFilaGama {
  constructor(private readonly uow: UnidadTrabajoGamas, private readonly autorizar: AutorizacionCatalogo) {}
  ejecutar(actor:string,edicion:EdicionGama,id:bigint,nombre:string) {
    return escribirGama(this.uow,this.autorizar,actor,edicion,async s=>{const e=encontrarElemento(await s.gruposFilas.listar(),id);e.editar(nombre,s.cuando);await s.gruposFilas.guardar(e);return e.id})
  }
}
