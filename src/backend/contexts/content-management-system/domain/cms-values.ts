import { Orden } from '../../../shared/domain/value-objects.js';

export type EstadoCMS = 'activo' | 'inactivo' | 'eliminado'
export type FechasCMS = { creadoEn: Date; actualizadoEn: Date; eliminadoEn: Date | null }
export type TipoDestinoCMS = 'producto' | 'industria' | 'servicio'
export type DestinoCMS = Readonly<{ tipo: TipoDestinoCMS; id: bigint }>

export function idCMS(id: bigint): bigint {
    if (typeof id !== 'bigint' || id <= 0n) throw new Error('ID positivo requerido')
    return id
}
export function textoCMS(valor: string, campo: string): string {
    if (typeof valor !== 'string' || !valor.trim()) throw new Error(`${campo} obligatorio`)
    return valor.trim()
}
export function fechaCMS(valor: Date): Date {
    if (!(valor instanceof Date) || !Number.isFinite(valor.getTime())) throw new Error('Fecha inválida')
    return new Date(valor.getTime())
}
export function destinoCMS(tipo: TipoDestinoCMS, id: bigint): DestinoCMS {
    if (!['producto', 'industria', 'servicio'].includes(tipo)) throw new Error('Destino inválido')
    return Object.freeze({ tipo, id: idCMS(id) })
}

export class RutaInterna {
    private constructor(readonly value: string) { }
    static create(value: string): RutaInterna {
        if (typeof value !== 'string' || !/^\/(?!\/)/.test(value) || /[\\\x00-\x1f\x7f]/.test(value)) throw new Error('Ruta interna inválida')
        return new RutaInterna(value)
    }
}
export class UrlExterna {
    private constructor(readonly value: string) { }
    static create(value: string): UrlExterna {
        let url: URL
        try { url = new URL(value) } catch { throw new Error('URL inválida') }
        if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) throw new Error('URL externa inválida')
        return new UrlExterna(url.toString())
    }
}
export type EnlaceCMS = RutaInterna | UrlExterna
export function enlaceCMS(value: string): EnlaceCMS {
    return value.startsWith('/') ? RutaInterna.create(value) : UrlExterna.create(value)
}

export abstract class EntidadCMS {
    protected _estado: EstadoCMS
    private readonly _creadoEn: Date
    private _actualizadoEn: Date
    private _eliminadoEn: Date | null
    protected constructor(estado: EstadoCMS, fechas: FechasCMS) {
        if (!['activo', 'inactivo', 'eliminado'].includes(estado)) throw new Error('Estado inválido')
        if ((estado === 'eliminado') !== (fechas.eliminadoEn !== null)) throw new Error('Eliminación inconsistente')
        this._creadoEn = fechaCMS(fechas.creadoEn)
        this._actualizadoEn = fechaCMS(fechas.actualizadoEn)
        this._eliminadoEn = fechas.eliminadoEn === null ? null : fechaCMS(fechas.eliminadoEn)
        if (this._actualizadoEn < this._creadoEn || (this._eliminadoEn !== null && this._eliminadoEn < this._actualizadoEn)) throw new Error('Fechas inconsistentes')
        this._estado = estado
    }
    get estado(): EstadoCMS { return this._estado }
    get creadoEn(): Date { return fechaCMS(this._creadoEn) }
    get actualizadoEn(): Date { return fechaCMS(this._actualizadoEn) }
    get eliminadoEn(): Date | null { return this._eliminadoEn === null ? null : fechaCMS(this._eliminadoEn) }
    protected tocar(cuando: Date): void {
        if (this._estado === 'eliminado') throw new Error('Registro eliminado')
        const fecha = fechaCMS(cuando)
        if (fecha < this._actualizadoEn) throw new Error('La fecha retrocede')
        this._actualizadoEn = fecha
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
        this.tocar(cuando); this._estado = 'eliminado'; this._eliminadoEn = fechaCMS(cuando)
    }
    protected cambiarOrden(orden: Orden, cuando: Date): Orden {
        this.tocar(cuando); return orden
    }
}