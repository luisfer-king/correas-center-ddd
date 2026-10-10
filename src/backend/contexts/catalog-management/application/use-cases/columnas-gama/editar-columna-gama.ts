import type { UnidadTrabajoGamas } from '../../ports/unidad-trabajo-gamas.js'
import type { AutorizacionCatalogo } from '../../acceso-catalogo.js'
import { escribirGama, type EdicionGama, encontrarElemento } from '../../gamas-aplicacion.js'
export class EditarColumnaGama {
  constructor(private readonly uow: UnidadTrabajoGamas, private readonly autorizar: AutorizacionCatalogo) {}
  ejecutar(actor:string,edicion:EdicionGama,id:bigint,datos:{grupoId:bigint|null;etiqueta:string|null;unidadMedida:string|null}) {
    return escribirGama(this.uow,this.autorizar,actor,edicion,async s=>{const e=encontrarElemento(await s.columnas.listar(),id);e.editar(datos,s.cuando);await s.columnas.guardar(e);return e.id})
  }
}
