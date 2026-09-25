import { Orden, Slug } from '../../../shared/domain/value-objects.js'
import type { EstadoCatalogo, FechasCatalogo } from './catalog-values.js'
import { RegistroCatalogo, idCatalogo, textoCatalogo } from './catalog-values.js'

export class Industria extends RegistroCatalogo {
    readonly id: bigint
    readonly empresaId: bigint
    readonly slug: Slug
    private _nombre: string
    private _imagen: string | null
    private _orden: Orden
    constructor(d: { id: bigint; empresaId: bigint; nombre: string; slug: Slug; imagen: string | null; orden: Orden; estado: EstadoCatalogo; fechas: FechasCatalogo }) {
        super(d.estado, d.fechas)
        this.id = idCatalogo(d.id); this.empresaId = idCatalogo(d.empresaId)
        this._nombre = textoCatalogo(d.nombre, 'Nombre'); this.slug = d.slug
        this._imagen = d.imagen; this._orden = d.orden
    }
    get nombre(): string { return this._nombre }
    get imagen(): string | null { return this._imagen }
    get orden(): Orden { return this._orden }
    editar(nombre: string, imagen: string | null, cuando: Date): void {
        const nuevo = textoCatalogo(nombre, 'Nombre')
        this.tocar(cuando); this._nombre = nuevo; this._imagen = imagen
    }
    reordenar(orden: Orden, cuando: Date): void { this.tocar(cuando); this._orden = orden }
}