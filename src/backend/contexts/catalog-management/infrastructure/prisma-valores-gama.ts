import type { TxCatalogo } from './operaciones-catalogo.js'
import type { RepositorioValoresGama } from '../application/ports/repositorio-valores-gama.js'
import type { ValorTecnico } from '../domain/valor-tecnico.js'
import { idGama } from '../domain/gama-values.js'
import { aValorGama, datosValorTecnico } from './mappers/valor-gama.js'
export class PrismaValoresGama implements RepositorioValoresGama {
  constructor(private readonly tx: TxCatalogo, private readonly gamaId: bigint, private readonly cuando: Date) {}
  async listar() { return (await this.tx.valorGama.findMany({ where: { gamaId: this.gamaId }, orderBy: [{ filaId:'asc' },{ columnaId:'asc' }] })).map(aValorGama) }
  private async padres(filaId: bigint, columnaId: bigint) {
    const fila=await this.tx.filaGama.findFirst({ where:{id:idGama(filaId),gamaId:this.gamaId,estado:{not:'eliminado'}},select:{id:true} })
    const columna=await this.tx.columnaGama.findFirst({ where:{id:idGama(columnaId),gamaId:this.gamaId,estado:{not:'eliminado'}},select:{tipoDato:true} })
    if (!fila || !columna) throw new Error('Fila o columna no disponible en la gama')
    return columna
  }
  async poner(filaId: bigint,columnaId: bigint,valor: ValorTecnico) {
    const columna=await this.padres(filaId,columnaId); valor.exigirTipo(columna.tipoDato)
    const data={...datosValorTecnico(valor),actualizadoEn:this.cuando}
    const f=await this.tx.valorGama.upsert({where:{filaId_columnaId:{filaId,columnaId}},create:{...data,filaId,columnaId,gamaId:this.gamaId,creadoEn:this.cuando},update:data})
    return aValorGama(f)
  }
  async quitar(filaId: bigint,columnaId: bigint) {
    await this.padres(filaId,columnaId)
    await this.tx.valorGama.deleteMany({where:{filaId,columnaId,gamaId:this.gamaId}})
  }
}
