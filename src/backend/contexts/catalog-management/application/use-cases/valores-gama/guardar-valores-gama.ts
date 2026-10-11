import type { UnidadTrabajoGamas } from '../../ports/unidad-trabajo-gamas.js'
import type { AutorizacionCatalogo } from '../../acceso-catalogo.js'
import { escribirGama, type EdicionGama } from '../../gamas-aplicacion.js'
import { ValorTecnico, type DatoTecnico } from '../../../domain/valor-tecnico.js'
import { idGama } from '../../../domain/gama-values.js'
export type CambioValorGama = {filaId:bigint;columnaId:bigint;valor:DatoTecnico|null}
export class GuardarValoresGama {
  constructor(private readonly uow:UnidadTrabajoGamas,private readonly autorizar:AutorizacionCatalogo) {}
  ejecutar(actor:string,edicion:EdicionGama,cambios:readonly CambioValorGama[]) {
    return escribirGama(this.uow,this.autorizar,actor,edicion,async s=>{
      if (!cambios.length) throw new Error('No hay valores para guardar')
      const claves=new Set<string>()
      const preparados=cambios.map(c=>{
        const filaId=idGama(c.filaId),columnaId=idGama(c.columnaId),clave=`${filaId}:${columnaId}`
        if (claves.has(clave)) throw new Error('Celda duplicada en la operación')
        claves.add(clave)
        return {filaId,columnaId,valor:c.valor===null?null:ValorTecnico.crear(c.valor)}
      })
      for (const c of preparados) {
        if (c.valor===null) await s.valores.quitar(c.filaId,c.columnaId)
        else await s.valores.poner(c.filaId,c.columnaId,c.valor)
      }
      return preparados.length
    })
  }
}
