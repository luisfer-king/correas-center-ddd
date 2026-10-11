import type { UnidadTrabajoGamas } from '../../ports/unidad-trabajo-gamas.js'
import type { AutorizacionCatalogo } from '../../acceso-catalogo.js'
import { escribirGama, type EdicionGama } from '../../gamas-aplicacion.js'
import type { DatosNuevaGrupoFilaGama } from '../../ports/repositorio-grupos-filas-gama.js'
export class CrearGrupoFilaGama {
  constructor(private readonly uow: UnidadTrabajoGamas, private readonly autorizar: AutorizacionCatalogo) {}
  ejecutar(actor:string,edicion:EdicionGama,datos:DatosNuevaGrupoFilaGama) {
    return escribirGama(this.uow,this.autorizar,actor,edicion,async s=>{const e=await s.gruposFilas.crear(datos);return e.id})
  }
}
