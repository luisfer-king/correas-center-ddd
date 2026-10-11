import { RegistroCatalogo } from './catalog-values.js'
import type { EstadoCatalogo, FechasCatalogo } from './catalog-values.js'
import { idGama, codigoGama, nombreGama, ordenGama } from './gama-values.js'
export type DatosGrupoGama = { id: bigint; gamaId: bigint; codigo: string; nombre: string; orden: number; estado: EstadoCatalogo; fechas: FechasCatalogo }
export abstract class GrupoGama extends RegistroCatalogo {
  readonly id: bigint
  readonly gamaId: bigint
  readonly codigo: string
  private _nombre: string
  private _orden: number
  constructor(d: DatosGrupoGama) {
    super(d.estado, d.fechas)
    this.id = idGama(d.id); this.gamaId = idGama(d.gamaId); this.codigo = codigoGama(d.codigo)
    this._nombre = nombreGama(d.nombre); this._orden = ordenGama(d.orden)
  }
  get nombre(): string { return this._nombre }
  get orden(): number { return this._orden }
  editar(nombre: string, cuando: Date): void { const nuevo = nombreGama(nombre); this.tocar(cuando); this._nombre = nuevo }
  reordenar(orden: number, cuando: Date): void { const nuevo = ordenGama(orden); this.tocar(cuando); this._orden = nuevo }
}
