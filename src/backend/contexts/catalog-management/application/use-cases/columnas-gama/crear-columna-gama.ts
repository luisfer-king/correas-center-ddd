import type { UnidadTrabajoGamas } from '../../ports/unidad-trabajo-gamas.js'
import type { AutorizacionCatalogo } from '../../acceso-catalogo.js'
import { escribirGama, type EdicionGama } from '../../gamas-aplicacion.js'
import type { DatosNuevaColumnaGama } from '../../ports/repositorio-columnas-gama.js'
export class CrearColumnaGama {
  constructor(private readonly uow: UnidadTrabajoGamas, private readonly autorizar: AutorizacionCatalogo) {}
  ejecutar(actor:string,edicion:EdicionGama,datos:DatosNuevaColumnaGama) {
    return escribirGama(this.uow,this.autorizar,actor,edicion,async s=>{const e=await s.columnas.crear(datos);return e.id},true)
  }
}
