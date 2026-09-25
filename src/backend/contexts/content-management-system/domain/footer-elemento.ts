import { Orden } from '../../../shared/domain/value-objects.js'
import type { DestinoCMS, EnlaceCMS, EstadoCMS, FechasCMS } from './cms-values.js'
import { EntidadCMS, destinoCMS, idCMS } from './cms-values.js'

export type TipoFooter = 'producto' | 'industria' | 'servicio' | 'red_social'
export class FooterElemento extends EntidadCMS {
    readonly id: bigint
    readonly empresaId: bigint
    readonly tipo: TipoFooter
    private _destino: DestinoCMS | null
    private _titulo: string | null
    private _enlace: EnlaceCMS | null
    private _icono: string | null
    private _orden: Orden
    private _mostrar: boolean
    constructor(d: { id: bigint; empresaId: bigint; tipo: TipoFooter; destino: DestinoCMS | null; titulo: string | null; enlace: EnlaceCMS | null; icono: string | null; orden: Orden; mostrar: boolean; estado: EstadoCMS; fechas: FechasCMS }) {
        super(d.estado, d.fechas)
        if (typeof d.mostrar !== 'boolean') throw new Error('Visibilidad inválida')
        if (!['producto', 'industria', 'servicio', 'red_social'].includes(d.tipo)) throw new Error('Tipo de footer inválido')
        this.id = idCMS(d.id); this.empresaId = idCMS(d.empresaId); this.tipo = d.tipo
        this._destino = d.destino === null ? null : destinoCMS(d.destino.tipo, d.destino.id)
        this._titulo = d.titulo; this._enlace = d.enlace; this._icono = d.icono
        this._orden = d.orden; this._mostrar = d.mostrar
    }
    get destino(): DestinoCMS | null { return this._destino }
    get titulo(): string | null { return this._titulo }
    get enlace(): EnlaceCMS | null { return this._enlace }
    get icono(): string | null { return this._icono }
    get orden(): Orden { return this._orden }
    get mostrar(): boolean { return this._mostrar }
    editar(d: { destino: DestinoCMS | null; titulo: string | null; enlace: EnlaceCMS | null; icono: string | null; mostrar: boolean }, cuando: Date): void {
        if (typeof d.mostrar !== 'boolean') throw new Error('Visibilidad inválida')
        if (d.destino !== null && (this.tipo === 'red_social' || d.destino.tipo !== this.tipo)) throw new Error('Destino no corresponde al tipo')
        if (this.tipo === 'red_social' && d.enlace === null) throw new Error('Red social sin enlace')
        const destino = d.destino === null ? null : destinoCMS(d.destino.tipo, d.destino.id)
        this.tocar(cuando); this._destino = destino; this._titulo = d.titulo
        this._enlace = d.enlace; this._icono = d.icono; this._mostrar = d.mostrar
    }
    reordenar(orden: Orden, cuando: Date): void { this._orden = this.cambiarOrden(orden, cuando) }
}