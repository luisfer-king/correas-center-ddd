import { Orden, Slug } from '../../../shared/domain/value-objects.js'
import type { EstadoCatalogo, FechasCatalogo } from './catalog-values.js'
import { RegistroCatalogo, idCatalogo, textoCatalogo } from './catalog-values.js'

export class Categoria extends RegistroCatalogo {
    readonly id: bigint
    readonly productoId: bigint
    readonly slug: Slug
    private _nombre: string
    private _imagen: string | null
    private _descripcion: string | null
    private _descripcionCorta: string | null
    private _uso: string | null
    private _orden: Orden
    constructor(d: { id: bigint; productoId: bigint; nombre: string; slug: Slug; imagen: string | null; descripcion: string | null; descripcionCorta: string | null; uso: string | null; orden: Orden; estado: EstadoCatalogo; fechas: FechasCatalogo }) {
        super(d.estado, d.fechas)
        this.id = idCatalogo(d.id); this.productoId = idCatalogo(d.productoId)
        this._nombre = textoCatalogo(d.nombre, 'Nombre'); this.slug = d.slug
        this._imagen = d.imagen; this._descripcion = d.descripcion
        this._descripcionCorta = d.descripcionCorta; this._uso = d.uso; this._orden = d.orden
    }
    get nombre(): string { return this._nombre }
    get imagen(): string | null { return this._imagen }
    get descripcion(): string | null { return this._descripcion }
    get descripcionCorta(): string | null { return this._descripcionCorta }
    get uso(): string | null { return this._uso }
    get orden(): Orden { return this._orden }
    editar(d: { nombre: string; imagen: string | null; descripcion: string | null; descripcionCorta: string | null; uso: string | null }, cuando: Date): void {
        const nombre = textoCatalogo(d.nombre, 'Nombre')
        this.tocar(cuando)
        this._nombre = nombre; this._imagen = d.imagen; this._descripcion = d.descripcion
        this._descripcionCorta = d.descripcionCorta; this._uso = d.uso
    }
    reordenar(orden: Orden, cuando: Date): void { this.tocar(cuando); this._orden = orden }
}