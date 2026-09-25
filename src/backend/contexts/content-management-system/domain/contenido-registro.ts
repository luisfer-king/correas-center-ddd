import { Orden } from '../../../shared/domain/value-objects.js';
import type { EstadoCMS, FechasCMS } from './cms-values.js';
import { EntidadCMS, idCMS } from './cms-values.js';

export type CamposContenidoRegistro = {
    titulo: string | null; subtitulo: string | null; descripcion: string | null
    icono: string | null; stats: string | null
}
export class ContenidoRegistro extends EntidadCMS {
    readonly id: bigint
    readonly empresaId: bigint
    readonly registroId: bigint
    private _campos: CamposContenidoRegistro
    private _orden: Orden
    constructor(d: { id: bigint; empresaId: bigint; registroId: bigint; campos: CamposContenidoRegistro; orden: Orden; estado: EstadoCMS; fechas: FechasCMS }) {
        super(d.estado, d.fechas)
        this.id = idCMS(d.id); this.empresaId = idCMS(d.empresaId); this.registroId = idCMS(d.registroId)
        this._campos = { ...d.campos }; this._orden = d.orden
    }
    get campos(): Readonly<CamposContenidoRegistro> { return { ...this._campos } }
    get orden(): Orden { return this._orden }
    editar(campos: CamposContenidoRegistro, cuando: Date): void { this.tocar(cuando); this._campos = { ...campos } }
    reordenar(orden: Orden, cuando: Date): void { this._orden = this.cambiarOrden(orden, cuando) }
}