import { Orden } from '../../../shared/domain/value-objects.js'
import type { EstadoCatalogo, FechasVinculo } from './catalog-values.js'
import { VinculoCatalogo, idCatalogo } from './catalog-values.js'

export class AsignacionMarca extends VinculoCatalogo {
    readonly productoId: bigint
    readonly marcaId: bigint
    private _orden: Orden | null
    constructor(d: { id: bigint; productoId: bigint; marcaId: bigint; orden: Orden | null; estado: EstadoCatalogo; fechas: FechasVinculo }) {
        super(d.id, d.estado, d.fechas)
        this.productoId = idCatalogo(d.productoId); this.marcaId = idCatalogo(d.marcaId)
        this._orden = d.orden
    }
    get orden(): Orden | null { return this._orden }
    reordenar(orden: Orden | null, cuando: Date): void { this.tocar(cuando); this._orden = orden }
    coincide(productoId: bigint, marcaId: bigint): boolean { return this.productoId === productoId && this.marcaId === marcaId }
}