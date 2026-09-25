import { Orden } from '../../../shared/domain/value-objects.js'
import type { EstadoCatalogo, FechasCatalogo } from './catalog-values.js'
import { RegistroCatalogo, idCatalogo, textoCatalogo } from './catalog-values.js'

export class Servicio extends RegistroCatalogo {
    readonly id: bigint
    readonly empresaId: bigint
    private _nombre: string
    private _descripcion: string | null
    private _imagen: string | null
    private _orden: Orden
    constructor(d: { id: bigint; empresaId: bigint; nombre: string; descripcion: string | null; imagen: string | null; orden: Orden; estado: EstadoCatalogo; fechas: FechasCatalogo }) {
        super(d.estado, d.fechas)
        this.id = idCatalogo(d.id); this.empresaId = idCatalogo(d.empresaId)
        this._nombre = textoCatalogo(d.nombre, 'Nombre'); this._descripcion = d.descripcion
        this._imagen = d.imagen; this._orden = d.orden
    }
    get nombre(): string { return this._nombre }
    get descripcion(): string | null { return this._descripcion }
    get imagen(): string | null { return this._imagen }
    get orden(): Orden { return this._orden }
    editar(nombre: string, descripcion: string | null, imagen: string | null, cuando: Date): void {
        const nuevo = textoCatalogo(nombre, 'Nombre')
        this.tocar(cuando); this._nombre = nuevo; this._descripcion = descripcion; this._imagen = imagen
    }
    reordenar(orden: Orden, cuando: Date): void { this.tocar(cuando); this._orden = orden }
}