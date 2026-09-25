import { Orden } from '../../../shared/domain/value-objects.js'
import type { EstadoCMS, FechasCMS } from './cms-values.js'
import { EntidadCMS, idCMS, textoCMS } from './cms-values.js'

export class PasoWizard extends EntidadCMS {
    readonly id: bigint
    readonly empresaId: bigint
    readonly identificador: string
    private _titulo: string
    private _descripcion: string
    private _fuenteDatos: string
    private _campoFiltro: string | null
    private _orden: Orden
    constructor(d: { id: bigint; empresaId: bigint; identificador: string; titulo: string; descripcion: string; fuenteDatos: string; campoFiltro: string | null; orden: Orden; estado: EstadoCMS; fechas: FechasCMS }) {
        super(d.estado, d.fechas)
        this.id = idCMS(d.id); this.empresaId = idCMS(d.empresaId)
        this.identificador = textoCMS(d.identificador, 'Identificador')
        this._titulo = textoCMS(d.titulo, 'Título'); this._descripcion = textoCMS(d.descripcion, 'Descripción')
        this._fuenteDatos = textoCMS(d.fuenteDatos, 'Fuente de datos')
        this._campoFiltro = d.campoFiltro; this._orden = d.orden
    }
    get titulo(): string { return this._titulo }
    get descripcion(): string { return this._descripcion }
    get fuenteDatos(): string { return this._fuenteDatos }
    get campoFiltro(): string | null { return this._campoFiltro }
    get orden(): Orden { return this._orden }
    editar(d: { titulo: string; descripcion: string; fuenteDatos: string; campoFiltro: string | null }, cuando: Date): void {
        const titulo = textoCMS(d.titulo, 'Título')
        const descripcion = textoCMS(d.descripcion, 'Descripción')
        const fuente = textoCMS(d.fuenteDatos, 'Fuente de datos')
        this.tocar(cuando); this._titulo = titulo; this._descripcion = descripcion
        this._fuenteDatos = fuente; this._campoFiltro = d.campoFiltro
    }
    reordenar(orden: Orden, cuando: Date): void { this._orden = this.cambiarOrden(orden, cuando) }
}

