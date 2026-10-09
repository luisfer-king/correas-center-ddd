import { Orden } from '../../../shared/domain/value-objects.js'
import type { EstadoCMS, FechasCMS } from './cms-values.js'
import { EntidadCMS, RutaInterna, idCMS, textoCMS } from './cms-values.js'

export class MenuItem extends EntidadCMS {
  readonly id: bigint
  readonly menuId: bigint
  private _nombre: string
  private _categoriaId: bigint | null
  private _ruta: RutaInterna
  private _orden: Orden
  constructor(d: { id: bigint; menuId: bigint; nombre: string; categoriaId: bigint | null; ruta: RutaInterna; orden: Orden; estado: EstadoCMS; fechas: FechasCMS }) {
    super(d.estado, d.fechas)
    this._nombre = textoCMS(d.nombre, 'Nombre'); if (this._nombre.length > 255) throw new Error('Nombre de ítem inválido (máximo 255)'); this._categoriaId = d.categoriaId === null ? null : idCMS(d.categoriaId)
    this.id = idCMS(d.id); this.menuId = idCMS(d.menuId); this._ruta = d.ruta; this._orden = d.orden
  }
  get nombre(): string { return this._nombre }
  get categoriaId(): bigint | null { return this._categoriaId }
  editar(nombre: string, categoriaId: bigint | null | undefined, cuando: Date): void {
    const nuevoNombre = textoCMS(nombre, 'Nombre'), categoria = categoriaId === undefined ? this._categoriaId : categoriaId === null ? null : idCMS(categoriaId)
    if (nuevoNombre.length > 255) throw new Error('Nombre de ítem inválido (máximo 255)'); this.tocar(cuando); this._nombre = nuevoNombre; this._categoriaId = categoria
  }
  get ruta(): RutaInterna { return this._ruta }
  get orden(): Orden { return this._orden }
  cambiarRuta(ruta: RutaInterna, cuando: Date): void { this.tocar(cuando); this._ruta = ruta }
  reordenar(orden: Orden, cuando: Date): void { if (orden.value < 1) throw new Error('Orden de ítem inválido'); this._orden = this.cambiarOrden(orden, cuando) }
}
