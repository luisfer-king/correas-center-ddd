import { fechaCMS, textoCMS } from './cms-values.js'

function enteroPositivo(id: number): number {
    if (!Number.isSafeInteger(id) || id <= 0) throw new Error('ID integer positivo requerido')
    return id
}

// La tabla antigua usa activo booleano, no enum estado ni eliminado_en.
export class ConfiguracionSitio {
    readonly id: number
    readonly empresaId: number | null
    readonly clave: string
    private _valor: string | null
    private _tipo: string | null
    private _descripcion: string | null
    private _grupo: string | null
    private _activo: boolean | null
    private readonly _creadoEn: Date | null
    private _actualizadoEn: Date | null

    constructor(d: { id: number; empresaId: number | null; clave: string; valor: string | null; tipo: string | null; descripcion: string | null; grupo: string | null; activo: boolean | null; creadoEn: Date | null; actualizadoEn: Date | null }) {
        if (d.activo !== null && typeof d.activo !== 'boolean') throw new Error('Indicador activo inválido')
        this.id = enteroPositivo(d.id)
        this.empresaId = d.empresaId === null ? null : enteroPositivo(d.empresaId)
        this.clave = textoCMS(d.clave, 'Clave')
        this._valor = d.valor; this._tipo = d.tipo; this._descripcion = d.descripcion
        this._grupo = d.grupo; this._activo = d.activo
        this._creadoEn = d.creadoEn === null ? null : fechaCMS(d.creadoEn)
        this._actualizadoEn = d.actualizadoEn === null ? null : fechaCMS(d.actualizadoEn)
    }
    get valor(): string | null { return this._valor }
    get tipo(): string | null { return this._tipo }
    get descripcion(): string | null { return this._descripcion }
    get grupo(): string | null { return this._grupo }
    get activo(): boolean | null { return this._activo }
    get creadoEn(): Date | null { return this._creadoEn === null ? null : fechaCMS(this._creadoEn) }
    get actualizadoEn(): Date | null { return this._actualizadoEn === null ? null : fechaCMS(this._actualizadoEn) }
    private tocar(cuando: Date): void {
        const siguiente = fechaCMS(cuando)
        if (this._actualizadoEn !== null && siguiente < this._actualizadoEn) throw new Error('La fecha retrocede')
        this._actualizadoEn = siguiente
    }
    editar(d: { valor: string | null; tipo: string | null; descripcion: string | null; grupo: string | null }, cuando: Date): void {
        if (d.tipo !== null) textoCMS(d.tipo, 'Tipo')
        this.tocar(cuando); this._valor = d.valor; this._tipo = d.tipo
        this._descripcion = d.descripcion; this._grupo = d.grupo
    }
    cambiarActivo(activo: boolean, cuando: Date): void {
        if (typeof activo !== 'boolean') throw new Error('Indicador activo inválido')
        this.tocar(cuando); this._activo = activo
    }
    esPublicable(): boolean { return this._activo === true }
}