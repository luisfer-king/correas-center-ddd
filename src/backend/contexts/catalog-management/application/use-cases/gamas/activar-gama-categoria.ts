import type { UnidadTrabajoGamas } from '../../ports/unidad-trabajo-gamas.js'
import type { AutorizacionCatalogo } from '../../acceso-catalogo.js'
import { escribirGama, type EdicionGama } from '../../gamas-aplicacion.js'
export class ActivarGamaCategoria {
  constructor(private readonly uow: UnidadTrabajoGamas, private readonly autorizar: AutorizacionCatalogo) {}
  ejecutar(actor:string,edicion:EdicionGama) {
    return escribirGama(this.uow,this.autorizar,actor,edicion,async s=>{s.gama.activar(s.cuando);return s.gama.id},true)
  }
}
