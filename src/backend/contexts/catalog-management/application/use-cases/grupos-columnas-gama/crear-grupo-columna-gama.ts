import type { UnidadTrabajoGamas } from '../../ports/unidad-trabajo-gamas.js'
import type { AutorizacionCatalogo } from '../../acceso-catalogo.js'
import { escribirGama, type EdicionGama } from '../../gamas-aplicacion.js'
import type { DatosNuevaGrupoColumnaGama } from '../../ports/repositorio-grupos-columnas-gama.js'
export class CrearGrupoColumnaGama {
  constructor(private readonly uow: UnidadTrabajoGamas, private readonly autorizar: AutorizacionCatalogo) {}
  ejecutar(actor:string,edicion:EdicionGama,datos:DatosNuevaGrupoColumnaGama) {
    return escribirGama(this.uow,this.autorizar,actor,edicion,async s=>{const e=await s.gruposColumnas.crear(datos);return e.id})
  }
}
