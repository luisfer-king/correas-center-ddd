import { Orden, Slug } from '../../../shared/domain/value-objects.js';
import type { EstadoCatalogo, FechasCatalogo } from './catalog-values.js';
import { RegistroCatalogo, idCatalogo, textoCatalogo } from './catalog-values.js';

export type CapacidadesAtributo = Readonly<{ descripcion: boolean; numero: boolean; unidad: boolean }>
export class TipoAtributo extends RegistroCatalogo {
    readonly id: bigint
    readonly slug: Slug
    private _nombre: string
    private _descripcion: string | null
    private _icono: string | null
    private _orden: Orden
    private _capacidades: CapacidadesAtributo
    constructor(d: { id: bigint; nombre: string; slug: Slug; descripcion: string | null; icono: string | null; orden: Orden; capacidades: CapacidadesAtributo; estado: EstadoCatalogo; fechas: FechasCatalogo }) {
        super(d.estado, d.fechas)
        this.id = idCatalogo(d.id); this.slug = d.slug; this._nombre = textoCatalogo(d.nombre, 'Nombre')
        this._descripcion = d.descripcion; this._icono = d.icono; this._orden = d.orden
        this._capacidades = TipoAtributo.validarCapacidades(d.capacidades)
    }
    private static validarCapacidades(c: CapacidadesAtributo): CapacidadesAtributo {
        if (typeof c.descripcion !== 'boolean' || typeof c.numero !== 'boolean' || typeof c.unidad !== 'boolean') throw new Error('Capacidades inválidas')
        return Object.freeze({ ...c })
    }
    get nombre(): string { return this._nombre }
    get descripcion(): string | null { return this._descripcion }
    get icono(): string | null { return this._icono }
    get orden(): Orden { return this._orden }
    get capacidades(): CapacidadesAtributo { return this._capacidades }
    validarValores(d: { descripcion: string | null; valorNumerico: string | null; unidadMedida: string | null }): void {
        if (d.descripcion !== null && !this._capacidades.descripcion) throw new Error('Descripción no permitida')
        if (d.valorNumerico !== null && !this._capacidades.numero) throw new Error('Número no permitido')
        if (d.unidadMedida !== null && !this._capacidades.unidad) throw new Error('Unidad no permitida')
    }
    editar(d: { nombre: string; descripcion: string | null; icono: string | null; capacidades: CapacidadesAtributo }, cuando: Date): void {
        const nombre = textoCatalogo(d.nombre, 'Nombre')
        const capacidades = TipoAtributo.validarCapacidades(d.capacidades)
        this.tocar(cuando)
        this._nombre = nombre; this._descripcion = d.descripcion; this._icono = d.icono; this._capacidades = capacidades
    }
    reordenar(orden: Orden, cuando: Date): void { this.tocar(cuando); this._orden = orden }
}