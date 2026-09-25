import { Orden } from '../../../shared/domain/value-objects.js'
import type { EstadoCatalogo, FechasVinculo } from './catalog-values.js'
import { VinculoCatalogo, idCatalogo, numeroDecimal } from './catalog-values.js'

export class AsignacionAtributo extends VinculoCatalogo {
    readonly categoriaId: bigint
    readonly atributoId: bigint
    private _valorPersonalizado: string | null
    private _orden: Orden
    constructor(d: { id: bigint; categoriaId: bigint; atributoId: bigint; valorPersonalizado: string | null; orden: Orden; estado: EstadoCatalogo; fechas: FechasVinculo }) {
        super(d.id, d.estado, d.fechas)
        this.categoriaId = idCatalogo(d.categoriaId); this.atributoId = idCatalogo(d.atributoId)
        this._valorPersonalizado = d.valorPersonalizado === null ? null : numeroDecimal(d.valorPersonalizado)
        this._orden = d.orden
    }
    get valorPersonalizado(): string | null { return this._valorPersonalizado }
    get orden(): Orden { return this._orden }
    personalizar(valor: string | null, cuando: Date): void {
        const nuevo = valor === null ? null : numeroDecimal(valor)
        this.tocar(cuando); this._valorPersonalizado = nuevo
    }
    reordenar(orden: Orden, cuando: Date): void { this.tocar(cuando); this._orden = orden }
    coincide(categoriaId: bigint, atributoId: bigint): boolean { return this.categoriaId === categoriaId && this.atributoId === atributoId }
}