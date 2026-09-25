import { Orden } from '../../../shared/domain/value-objects.js';
import type { EstadoCatalogo, FechasVinculo } from './catalog-values.js';
import { VinculoCatalogo, idCatalogo } from './catalog-values.js';

export type DestinoIndustria = Readonly<{ tipo: 'categoria' | 'servicio'; id: bigint }>
export class AsignacionIndustria extends VinculoCatalogo {
    readonly industriaId: bigint
    readonly destino: DestinoIndustria
    private _orden: Orden
    constructor(d: { id: bigint; industriaId: bigint; destino: DestinoIndustria; orden: Orden; estado: EstadoCatalogo; fechas: FechasVinculo }) {
        super(d.id, d.estado, d.fechas)
        if (!['categoria', 'servicio'].includes(d.destino.tipo)) throw new Error('Tipo de destino inválido')
        this.industriaId = idCatalogo(d.industriaId)
        this.destino = Object.freeze({ tipo: d.destino.tipo, id: idCatalogo(d.destino.id) })
        this._orden = d.orden
    }
    get orden(): Orden { return this._orden }
    reordenar(orden: Orden, cuando: Date): void { this.tocar(cuando); this._orden = orden }
    coincide(industriaId: bigint, destino: DestinoIndustria): boolean {
        return this.industriaId === industriaId && this.destino.tipo === destino.tipo && this.destino.id === destino.id
    }
}