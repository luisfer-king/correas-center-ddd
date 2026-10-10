import { RegistroCatalogo } from './catalog-values.js'
import type { EstadoCatalogo, FechasCatalogo } from './catalog-values.js'
import { idGama, codigoGama, nombreGama, ordenGama, textoOpcionalGama, enlaceGama } from './gama-values.js'
export type DetalleFilaGama = { grupoId: bigint | null; nombre: string; descripcion: string | null; enlaceDetalle: string | null }
export class FilaGama extends RegistroCatalogo {
  readonly id: bigint
  readonly gamaId: bigint
  readonly codigo: string
  private _detalle: Readonly<DetalleFilaGama>
  private _orden: number
  constructor(d: DetalleFilaGama & { id: bigint; gamaId: bigint; codigo: string; orden: number; estado: EstadoCatalogo; fechas: FechasCatalogo }) {
    super(d.estado, d.fechas)
    this.id = idGama(d.id); this.gamaId = idGama(d.gamaId); this.codigo = codigoGama(d.codigo)
    this._detalle = FilaGama.validar(d); this._orden = ordenGama(d.orden)
  }
  private static validar(d: DetalleFilaGama): Readonly<DetalleFilaGama> {
    return Object.freeze({ grupoId: d.grupoId === null ? null : idGama(d.grupoId), nombre: nombreGama(d.nombre), descripcion: textoOpcionalGama(d.descripcion), enlaceDetalle: enlaceGama(d.enlaceDetalle) })
  }
  get detalle(): Readonly<DetalleFilaGama> { return { ...this._detalle } }
  get orden(): number { return this._orden }
  editar(d: DetalleFilaGama, cuando: Date): void { const nuevo = FilaGama.validar(d); this.tocar(cuando); this._detalle = nuevo }
  reordenar(orden: number, cuando: Date): void { const nuevo = ordenGama(orden); this.tocar(cuando); this._orden = nuevo }
}
