import { fechaCatalogo } from './catalog-values.js'
import { idGama } from './gama-values.js'
import { ValorTecnico } from './valor-tecnico.js'
import type { TipoDatoAtributo } from './valor-tecnico.js'
export class ValorGama {
  readonly filaId: bigint
  readonly columnaId: bigint
  readonly gamaId: bigint
  private _valor: ValorTecnico
  private readonly _creadoEn: Date
  private _actualizadoEn: Date
  constructor(d: { filaId: bigint; columnaId: bigint; gamaId: bigint; tipoDato: TipoDatoAtributo; valor: ValorTecnico; creadoEn: Date; actualizadoEn: Date }) {
    this.filaId = idGama(d.filaId); this.columnaId = idGama(d.columnaId); this.gamaId = idGama(d.gamaId)
    d.valor.exigirTipo(d.tipoDato); this._valor = d.valor
    this._creadoEn = fechaCatalogo(d.creadoEn); this._actualizadoEn = fechaCatalogo(d.actualizadoEn)
    if (this._actualizadoEn < this._creadoEn) throw new Error('Fechas inconsistentes')
  }
  get valor(): ValorTecnico { return this._valor }
  get creadoEn(): Date { return fechaCatalogo(this._creadoEn) }
  get actualizadoEn(): Date { return fechaCatalogo(this._actualizadoEn) }
  cambiar(valor: ValorTecnico, cuando: Date): void {
    valor.exigirTipo(this._valor.tipo)
    const fecha = fechaCatalogo(cuando)
    if (fecha < this._actualizadoEn) throw new Error('La fecha retrocede')
    this._valor = valor; this._actualizadoEn = fecha
  }
}
