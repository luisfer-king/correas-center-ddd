import type { UnidadTrabajoGamas } from '../../ports/unidad-trabajo-gamas.js'
import type { AutorizacionCatalogo } from '../../acceso-catalogo.js'
import { escribirGama, type EdicionGama } from '../../gamas-aplicacion.js'
import type { DatosNuevaFilaGama } from '../../ports/repositorio-filas-gama.js'
export class CrearFilaGama {
  constructor(private readonly uow: UnidadTrabajoGamas, private readonly autorizar: AutorizacionCatalogo) {}
  ejecutar(actor:string,edicion:EdicionGama,datos:DatosNuevaFilaGama) {
    return escribirGama(this.uow,this.autorizar,actor,edicion,async s=>{const e=await s.filas.crear(datos);return e.id})
  }
}
