import { Orden, Slug } from '../../../shared/domain/value-objects.js'
import type { EstadoCMS, FechasCMS } from './cms-values.js'
import { EntidadCMS, idCMS, textoCMS } from './cms-values.js'
import type { MetadataSeccion } from './metadata-seccion.js'
import { camposMetadata, validarMetadataSeccion } from './metadata-seccion.js'

export class TipoSeccion extends EntidadCMS {
    readonly id: bigint
    readonly slug: Slug
    private _nombre: string
    private _descripcion: string | null
    private _icono: string | null
    private _orden: Orden
    private _camposMetadata: readonly string[]
    constructor(d: { id: bigint; nombre: string; slug: Slug; descripcion: string | null; camposMetadata: readonly string[]; icono: string | null; orden: Orden; estado: EstadoCMS; fechas: FechasCMS }) {
        super(d.estado, d.fechas)
        this.id = idCMS(d.id); this._nombre = textoCMS(d.nombre, 'Nombre')
        this.slug = d.slug; this._descripcion = d.descripcion; this._icono = d.icono
        this._orden = d.orden; this._camposMetadata = camposMetadata(d.camposMetadata)
    }
    get nombre(): string { return this._nombre }
    get descripcion(): string | null { return this._descripcion }
    get icono(): string | null { return this._icono }
    get orden(): Orden { return this._orden }
    get clavesMetadata(): readonly string[] { return this._camposMetadata }
    validarMetadata(metadata: unknown): MetadataSeccion {
        return validarMetadataSeccion(this._camposMetadata, metadata)
    }
    editar(nombre: string, descripcion: string | null, icono: string | null, cuando: Date): void {
        const nuevo = textoCMS(nombre, 'Nombre')
        this.tocar(cuando); this._nombre = nuevo; this._descripcion = descripcion; this._icono = icono
    }
    cambiarClaves(claves: readonly string[], cuando: Date): void {
        const nuevas = camposMetadata(claves)
        this.tocar(cuando); this._camposMetadata = nuevas
    }
    reordenar(orden: Orden, cuando: Date): void { this._orden = this.cambiarOrden(orden, cuando) }
}