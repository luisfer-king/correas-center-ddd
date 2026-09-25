import { Orden } from '../../../shared/domain/value-objects.js';

export type EstadoCatalogo = 'activo' | 'inactivo' | 'eliminado'
export type FechasCatalogo = { creadoEn: Date; actualizadoEn: Date; eliminadoEn: Date | null }
export type FechasVinculo = { creadoEn: Date; actualizadoEn: Date }

export function idCatalogo(id: bigint): bigint {
    if (typeof id !== 'bigint' || id <= 0n) throw new Error('ID positivo requerido')
    return id
}
export function textoCatalogo(valor: string, campo: string): string {
    if (typeof valor !== 'string' || !valor.trim()) throw new Error(`${campo} obligatorio`)
    return valor.trim()
}
export function fechaCatalogo(valor: Date): Date {
    if (!(valor instanceof Date) || !Number.isFinite(valor.getTime())) throw new Error('Fecha inválida')
    return new Date(valor.getTime())
}
export function numeroDecimal(valor: string): string {
    if (!/^-?(?:0|[1-9]\d*)(?:\.\d+)?$/.test(valor)) throw new Error('Decimal inválido')
    return valor
}
export function ordenNullable(valor: number | null): Orden | null {
    return valor === null ? null : Orden.create(valor)
}
function estadoValido(estado: EstadoCatalogo): void {
    if (!['activo', 'inactivo', 'eliminado'].includes(estado)) throw new Error('Estado inválido')
}

export abstract class RegistroCatalogo {
    protected _estado: EstadoCatalogo
    private readonly _creadoEn: Date
    private _actualizadoEn: Date
    private _eliminadoEn: Date | null
    protected constructor(estado: EstadoCatalogo, fechas: FechasCatalogo) {
        estadoValido(estado)
        if ((estado === 'eliminado') !== (fechas.eliminadoEn !== null)) throw new Error('Eliminación inconsistente')
        this._creadoEn = fechaCatalogo(fechas.creadoEn)
        this._actualizadoEn = fechaCatalogo(fechas.actualizadoEn)
        this._eliminadoEn = fechas.eliminadoEn === null ? null : fechaCatalogo(fechas.eliminadoEn)
        if (this._actualizadoEn < this._creadoEn || (this._eliminadoEn !== null && this._eliminadoEn < this._creadoEn)) throw new Error('Fechas inconsistentes')
        this._estado = estado
    }
    get estado(): EstadoCatalogo { return this._estado }
    get creadoEn(): Date { return fechaCatalogo(this._creadoEn) }
    get actualizadoEn(): Date { return fechaCatalogo(this._actualizadoEn) }
    get eliminadoEn(): Date | null { return this._eliminadoEn === null ? null : fechaCatalogo(this._eliminadoEn) }
    protected tocar(cuando: Date): void {
        if (this._estado === 'eliminado') throw new Error('Registro eliminado')
        const fecha = fechaCatalogo(cuando)
        if (fecha < this._actualizadoEn) throw new Error('La fecha retrocede')
        this._actualizadoEn = fecha
    }
    inactivar(cuando: Date): void {
        if (this._estado !== 'activo') throw new Error('El registro no está activo')
        this.tocar(cuando); this._estado = 'inactivo'
    }
    activar(cuando: Date): void {
        if (this._estado !== 'inactivo') throw new Error('El registro no está inactivo')
        this.tocar(cuando); this._estado = 'activo'
    }
    eliminar(cuando: Date): void {
        this.tocar(cuando); this._estado = 'eliminado'; this._eliminadoEn = fechaCatalogo(cuando)
    }
}

// Las tres tablas puente heredadas carecen de eliminado_en: su borrado lógico
// solo cambia el enum estado y actualizado_en.
export abstract class VinculoCatalogo {
    readonly id: bigint
    protected _estado: EstadoCatalogo
    private readonly _creadoEn: Date
    private _actualizadoEn: Date
    protected constructor(id: bigint, estado: EstadoCatalogo, fechas: FechasVinculo) {
        this.id = idCatalogo(id); estadoValido(estado); this._estado = estado
        this._creadoEn = fechaCatalogo(fechas.creadoEn)
        this._actualizadoEn = fechaCatalogo(fechas.actualizadoEn)
        if (this._actualizadoEn < this._creadoEn) throw new Error('Fechas inconsistentes')
    }
    get estado(): EstadoCatalogo { return this._estado }
    get creadoEn(): Date { return fechaCatalogo(this._creadoEn) }
    get actualizadoEn(): Date { return fechaCatalogo(this._actualizadoEn) }
    protected tocar(cuando: Date): void {
        if (this._estado === 'eliminado') throw new Error('Relación eliminada')
        const fecha = fechaCatalogo(cuando)
        if (fecha < this._actualizadoEn) throw new Error('La fecha retrocede')
        this._actualizadoEn = fecha
    }
    inactivar(cuando: Date): void {
        if (this._estado !== 'activo') throw new Error('Relación no activa')
        this.tocar(cuando); this._estado = 'inactivo'
    }
    activar(cuando: Date): void {
        if (this._estado !== 'inactivo') throw new Error('Relación no inactiva')
        this.tocar(cuando); this._estado = 'activo'
    }
    eliminar(cuando: Date): void {
        this.tocar(cuando); this._estado = 'eliminado'
    }
}