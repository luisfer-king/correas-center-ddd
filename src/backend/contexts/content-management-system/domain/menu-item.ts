import { Orden } from '../../../shared/domain/value-objects.js'
import type { EstadoCMS, FechasCMS } from './cms-values.js'
import { EntidadCMS, RutaInterna, idCMS } from './cms-values.js'

export class MenuItem extends EntidadCMS {
    readonly id: bigint
    readonly menuId: bigint
    private _ruta: RutaInterna
    private _orden: Orden
    constructor(d: { id: bigint; menuId: bigint; ruta: RutaInterna; orden: Orden; estado: EstadoCMS; fechas: FechasCMS }) {
        super(d.estado, d.fechas)
        this.id = idCMS(d.id); this.menuId = idCMS(d.menuId); this._ruta = d.ruta; this._orden = d.orden
    }
    get ruta(): RutaInterna { return this._ruta }
    get orden(): Orden { return this._orden }
    cambiarRuta(ruta: RutaInterna, cuando: Date): void { this.tocar(cuando); this._ruta = ruta }
    reordenar(orden: Orden, cuando: Date): void { this._orden = this.cambiarOrden(orden, cuando) }
}