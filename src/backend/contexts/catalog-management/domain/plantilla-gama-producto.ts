import { fechaCatalogo } from './catalog-values.js'
import { idGama } from './gama-values.js'
import type { GamaCategoria } from './gama-categoria.js'
export class PlantillaGamaProducto {
  readonly productoId: bigint
  private _gamaId: bigint
  private readonly _creadoEn: Date
  private _actualizadoEn: Date
  constructor(d: { productoId: bigint; gama: GamaCategoria; creadoEn: Date; actualizadoEn: Date }) {
    this.productoId = idGama(d.productoId); this.validar(d.gama); this._gamaId = d.gama.id
    this._creadoEn = fechaCatalogo(d.creadoEn); this._actualizadoEn = fechaCatalogo(d.actualizadoEn)
    if (this._actualizadoEn < this._creadoEn) throw new Error('Fechas inconsistentes')
  }
  private validar(gama: GamaCategoria): void {
    if (gama.productoId !== this.productoId || gama.estado !== 'activo') throw new Error('La plantilla debe ser una gama activa del mismo producto')
  }
  get gamaId(): bigint { return this._gamaId }
  get creadoEn(): Date { return fechaCatalogo(this._creadoEn) }
  get actualizadoEn(): Date { return fechaCatalogo(this._actualizadoEn) }
  seleccionar(gama: GamaCategoria, cuando: Date): void {
    this.validar(gama); const fecha = fechaCatalogo(cuando)
    if (fecha < this._actualizadoEn) throw new Error('La fecha retrocede')
    this._gamaId = gama.id; this._actualizadoEn = fecha
  }
}
