export type EstadoRegistroCRM = 'activo' | 'inactivo' | 'eliminado'
export type EstadoSuscriptor = 'activo' | 'inactivo' | 'desuscrito'
export type FechasCRM = { creadoEn: Date; actualizadoEn: Date; eliminadoEn: Date | null }

export function idCRM(value: bigint): bigint {
    if (typeof value !== 'bigint' || value <= 0n) throw new Error('ID bigint positivo requerido')
    return value
}
export function textoCRM(value: string, field: string): string {
    if (typeof value !== 'string' || !value.trim()) throw new Error(`${field} obligatorio`)
    return value.trim()
}
export function fechaCRM(value: Date): Date {
    if (!(value instanceof Date) || !Number.isFinite(value.getTime())) throw new Error('Fecha inválida')
    return new Date(value.getTime())
}

// PostgreSQL numeric se transporta como string; Number() puede redondear
// coordenadas de escala arbitraria.
export function coordenada(value: string, limite: 90 | 180): string {
    if (!/^-?(?:0|[1-9]\d*)(?:\.\d+)?$/.test(value)) throw new Error('Coordenada decimal inválida')
    const magnitude = value.replace(/^-/, '')
    const [entero, fraccion] = magnitude.split('.')
    const borde = BigInt(entero)
    if (borde > BigInt(limite) || (borde === BigInt(limite) && fraccion !== undefined && /[1-9]/.test(fraccion))) {
        throw new Error('Coordenada fuera de rango')
    }
    return value
}

export class Ubicacion {
    private constructor(readonly latitud: string | null, readonly longitud: string | null) { }
    static create(latitud: string | null, longitud: string | null): Ubicacion {
        // La tabla heredada permite cada coordenada por separado.
        return new Ubicacion(latitud === null ? null : coordenada(latitud, 90), longitud === null ? null : coordenada(longitud, 180))
    }
}

export abstract class RegistroCRM {
    protected _estado: EstadoRegistroCRM
    private readonly _creadoEn: Date
    private _actualizadoEn: Date
    private _eliminadoEn: Date | null
    protected constructor(estado: EstadoRegistroCRM, fechas: FechasCRM) {
        if (!['activo', 'inactivo', 'eliminado'].includes(estado)) throw new Error('Estado inválido')
        if ((estado === 'eliminado') !== (fechas.eliminadoEn !== null)) throw new Error('Estado y eliminación inconsistentes')
        this._creadoEn = fechaCRM(fechas.creadoEn)
        this._actualizadoEn = fechaCRM(fechas.actualizadoEn)
        this._eliminadoEn = fechas.eliminadoEn === null ? null : fechaCRM(fechas.eliminadoEn)
        if (this._actualizadoEn < this._creadoEn || (this._eliminadoEn !== null && this._eliminadoEn < this._actualizadoEn)) throw new Error('Fechas inconsistentes')
        this._estado = estado
    }
    get estado(): EstadoRegistroCRM { return this._estado }
    get creadoEn(): Date { return fechaCRM(this._creadoEn) }
    get actualizadoEn(): Date { return fechaCRM(this._actualizadoEn) }
    get eliminadoEn(): Date | null { return this._eliminadoEn === null ? null : fechaCRM(this._eliminadoEn) }
    protected tocar(cuando: Date): void {
        if (this._estado === 'eliminado') throw new Error('Registro eliminado')
        const siguiente = fechaCRM(cuando)
        if (siguiente < this._actualizadoEn) throw new Error('La fecha retrocede')
        this._actualizadoEn = siguiente
    }
    inactivar(cuando: Date): void {
        if (this._estado !== 'activo') throw new Error('Registro no activo')
        this.tocar(cuando); this._estado = 'inactivo'
    }
    activar(cuando: Date): void {
        if (this._estado !== 'inactivo') throw new Error('Registro no inactivo')
        this.tocar(cuando); this._estado = 'activo'
    }
    eliminar(cuando: Date): void {
        this.tocar(cuando); this._estado = 'eliminado'; this._eliminadoEn = fechaCRM(cuando)
    }
}