import { Orden } from '../../../shared/domain/value-objects.js'
import type { EstadoCMS, FechasCMS } from './cms-values.js'
import { EntidadCMS, idCMS, textoCMS } from './cms-values.js'

export class RegistroCMS extends EntidadCMS {
    readonly id: bigint
    readonly identificador: string
    private _nombre: string
    private _descripcion: string | null
    private _orden: Orden
    constructor(d: { id: bigint; identificador: string; nombre: string; descripcion: string | null; orden: Orden; estado: EstadoCMS; fechas: FechasCMS }) {
        super(d.estado, d.fechas)
        this.id = idCMS(d.id); this.identificador = textoCMS(d.identificador, 'Identificador')
        this._nombre = textoCMS(d.nombre, 'Nombre'); this._descripcion = d.descripcion; this._orden = d.orden
    }
    get nombre(): string { return this._nombre }
    get descripcion(): string | null { return this._descripcion }
    get orden(): Orden { return this._orden }
    editar(nombre: string, descripcion: string | null, cuando: Date): void {
        const nuevo = textoCMS(nombre, 'Nombre')
        this.tocar(cuando); this._nombre = nuevo; this._descripcion = descripcion
    }
    reordenar(orden: Orden, cuando: Date): void { this._orden = this.cambiarOrden(orden, cuando) }
}