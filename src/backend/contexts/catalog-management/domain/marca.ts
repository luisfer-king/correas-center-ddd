import { Orden, Slug } from '../../../shared/domain/value-objects.js'
import type { EstadoCatalogo, FechasCatalogo } from './catalog-values.js'
import { RegistroCatalogo, idCatalogo, textoCatalogo } from './catalog-values.js'

export class Marca extends RegistroCatalogo {
    readonly id: bigint
    readonly slug: Slug
    private _nombre: string
    private _logo: string | null
    private _orden: Orden
    constructor(d: { id: bigint; nombre: string; slug: Slug; logo: string | null; orden: Orden; estado: EstadoCatalogo; fechas: FechasCatalogo }) {
        super(d.estado, d.fechas)
        this.id = idCatalogo(d.id); this._nombre = textoCatalogo(d.nombre, 'Nombre')
        this.slug = d.slug; this._logo = d.logo; this._orden = d.orden
    }
    get nombre(): string { return this._nombre }
    get logo(): string | null { return this._logo }
    get orden(): Orden { return this._orden }
    editar(nombre: string, logo: string | null, cuando: Date): void {
        const valor = textoCatalogo(nombre, 'Nombre')
        this.tocar(cuando); this._nombre = valor; this._logo = logo
    }
    reordenar(orden: Orden, cuando: Date): void { this.tocar(cuando); this._orden = orden }
}