import { RegistroCatalogo } from './catalog-values.js'
import type { EstadoCatalogo, FechasCatalogo } from './catalog-values.js'
import { idGama, ordenGama, textoOpcionalGama } from './gama-values.js'
import { tipoDatoAtributo } from './valor-tecnico.js'
import type { TipoDatoAtributo } from './valor-tecnico.js'
export type PresentacionColumnaGama = { grupoId: bigint | null; etiqueta: string | null; unidadMedida: string | null }
export class ColumnaGama extends RegistroCatalogo {
  readonly id: bigint
  readonly gamaId: bigint
  readonly atributoId: bigint
  readonly tipoDato: TipoDatoAtributo
  private _presentacion: Readonly<PresentacionColumnaGama>
  private _orden: number
  constructor(d: PresentacionColumnaGama & { id: bigint; gamaId: bigint; atributoId: bigint; tipoDato: TipoDatoAtributo; orden: number; estado: EstadoCatalogo; fechas: FechasCatalogo }) {
    super(d.estado, d.fechas)
    this.id = idGama(d.id); this.gamaId = idGama(d.gamaId); this.atributoId = idGama(d.atributoId)
    this.tipoDato = tipoDatoAtributo(d.tipoDato); this._presentacion = ColumnaGama.validar(d); this._orden = ordenGama(d.orden)
  }
  private static validar(d: PresentacionColumnaGama): Readonly<PresentacionColumnaGama> {
    return Object.freeze({ grupoId: d.grupoId === null ? null : idGama(d.grupoId), etiqueta: textoOpcionalGama(d.etiqueta, 255), unidadMedida: textoOpcionalGama(d.unidadMedida, 80) })
  }
  get presentacion(): Readonly<PresentacionColumnaGama> { return { ...this._presentacion } }
  get orden(): number { return this._orden }
  editar(d: PresentacionColumnaGama, cuando: Date): void { const nueva = ColumnaGama.validar(d); this.tocar(cuando); this._presentacion = nueva }
  reordenar(orden: number, cuando: Date): void { const nuevo = ordenGama(orden); this.tocar(cuando); this._orden = nuevo }
}
