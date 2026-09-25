import { Orden } from '../../../shared/domain/value-objects.js';
import type { EstadoCatalogo, FechasCatalogo } from './catalog-values.js';
import { RegistroCatalogo, idCatalogo, numeroDecimal, textoCatalogo } from './catalog-values.js';

export type ValoresAtributo = { descripcion: string | null; valorNumerico: string | null; unidadMedida: string | null }
export class AtributoTecnico extends RegistroCatalogo {
    readonly id: bigint
    readonly tipoAtributoId: bigint
    private _nombre: string
    private _valores: ValoresAtributo
    private _orden: Orden
    constructor(d: { id: bigint; tipoAtributoId: bigint; nombre: string; valores: ValoresAtributo; orden: Orden; estado: EstadoCatalogo; fechas: FechasCatalogo }) {
        super(d.estado, d.fechas)
        this.id = idCatalogo(d.id); this.tipoAtributoId = idCatalogo(d.tipoAtributoId)
        this._nombre = textoCatalogo(d.nombre, 'Nombre'); this._valores = AtributoTecnico.validar(d.valores)
        this._orden = d.orden
    }
    private static validar(d: ValoresAtributo): ValoresAtributo {
        return Object.freeze({ descripcion: d.descripcion, valorNumerico: d.valorNumerico === null ? null : numeroDecimal(d.valorNumerico), unidadMedida: d.unidadMedida })
    }
    get nombre(): string { return this._nombre }
    get valores(): Readonly<ValoresAtributo> { return { ...this._valores } }
    get orden(): Orden { return this._orden }
    editar(nombre: string, valores: ValoresAtributo, cuando: Date): void {
        const nuevoNombre = textoCatalogo(nombre, 'Nombre')
        const nuevosValores = AtributoTecnico.validar(valores)
        this.tocar(cuando); this._nombre = nuevoNombre; this._valores = nuevosValores
    }
    reordenar(orden: Orden, cuando: Date): void { this.tocar(cuando); this._orden = orden }
}