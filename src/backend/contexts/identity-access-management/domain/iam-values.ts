export type EstadoIAM = 'activo' | 'inactivo' | 'eliminado'
export type AccionAuditoria = 'Lectura' | 'Creación' | 'Edición' | 'Eliminación'
export type Json = null | boolean | number | string | Json[] | { [key: string]: Json }

export function uuid(value: string): string {
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)) {
        throw new Error('UUID inválido')
    }
    return value.toLowerCase()
}

export function idPositivo(value: bigint): bigint {
    if (value <= 0n) throw new Error('ID inválido')
    return value
}

export function texto(value: string, nombre: string): string {
    const limpio = value.trim()
    if (!limpio) throw new Error(nombre + ' no puede estar vacío')
    return limpio
}

export function fecha(value: Date): Date {
    if (!(value instanceof Date) || !Number.isFinite(value.getTime())) throw new Error('Fecha inválida')
    return new Date(value.getTime())
}

export class HashArgon2id {
    #value: string
    private constructor(value: string) { this.#value = value }
    static fromHash(value: string): HashArgon2id {
        if (!value.startsWith('$argon2id$')) throw new Error('Se requiere hash Argon2id')
        return new HashArgon2id(value)
    }
    get value(): string { return this.#value }
}

export type FechasIAM = {
    creadoEn: Date
    actualizadoEn: Date
    eliminadoEn: Date | null
}

export abstract class RegistroIAM {
    protected _estado: EstadoIAM
    protected _actualizadoEn: Date
    protected _eliminadoEn: Date | null
    private readonly _creadoEn: Date

    protected constructor(estado: EstadoIAM, fechas: FechasIAM) {
        if (!['activo', 'inactivo', 'eliminado'].includes(estado)) throw new Error('Estado inválido')
        if ((estado === 'eliminado') !== (fechas.eliminadoEn !== null)) {
            throw new Error('Estado y fecha de eliminación inconsistentes')
        }
        this._estado = estado
        this._creadoEn = fecha(fechas.creadoEn)
        this._actualizadoEn = fecha(fechas.actualizadoEn)
        this._eliminadoEn = fechas.eliminadoEn ? fecha(fechas.eliminadoEn) : null
    }
    get estado(): EstadoIAM { return this._estado }
    get creadoEn(): Date { return fecha(this._creadoEn) }
    get actualizadoEn(): Date { return fecha(this._actualizadoEn) }
    get eliminadoEn(): Date | null { return this._eliminadoEn ? fecha(this._eliminadoEn) : null }
    protected tocar(cuando: Date): void {
        if (this._estado === 'eliminado') throw new Error('Registro eliminado')
        const siguiente = fecha(cuando)
        if (siguiente < this._actualizadoEn) throw new Error('La fecha retrocede')
        this._actualizadoEn = siguiente
    }
    inactivar(cuando: Date): void {
        if (this._estado !== 'activo') throw new Error('Solo se puede inactivar un registro activo')
        this.tocar(cuando)
        this._estado = 'inactivo'
    }
    activar(cuando: Date): void {
        if (this._estado !== 'inactivo') throw new Error('Solo se puede activar un registro inactivo')
        this.tocar(cuando)
        this._estado = 'activo'
    }
    eliminar(cuando: Date): void {
        if (this._estado === 'eliminado') throw new Error('El registro ya está eliminado')
        this.tocar(cuando)
        this._estado = 'eliminado'
        this._eliminadoEn = fecha(cuando)
    }
}