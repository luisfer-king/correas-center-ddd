import { Email } from '../../../shared/domain/value-objects.js'
import type { EstadoSuscriptor, FechasCRM } from './commercial-values.js'
import { fechaCRM, idCRM, textoCRM } from './commercial-values.js'

export class Suscriptor {
    readonly id: bigint
    readonly empresaId: bigint
    readonly email: Email
    private _nombre: string | null
    private _estado: EstadoSuscriptor
    private _emailVerificadoEn: Date | null
    private readonly _creadoEn: Date
    private _actualizadoEn: Date
    private _eliminadoEn: Date | null

    constructor(d: { id: bigint; empresaId: bigint; email: Email; nombre: string | null; estado: EstadoSuscriptor; emailVerificadoEn: Date | null; fechas: FechasCRM }) {
        if (!['activo', 'inactivo', 'desuscrito'].includes(d.estado)) throw new Error('Estado de suscriptor inválido')
        this.id = idCRM(d.id); this.empresaId = idCRM(d.empresaId); this.email = d.email
        this._nombre = d.nombre; this._estado = d.estado
        this._emailVerificadoEn = d.emailVerificadoEn === null ? null : fechaCRM(d.emailVerificadoEn)
        this._creadoEn = fechaCRM(d.fechas.creadoEn)
        this._actualizadoEn = fechaCRM(d.fechas.actualizadoEn)
        this._eliminadoEn = d.fechas.eliminadoEn === null ? null : fechaCRM(d.fechas.eliminadoEn)
        if (this._actualizadoEn < this._creadoEn || (this._eliminadoEn !== null && this._eliminadoEn < this._actualizadoEn)) throw new Error('Fechas inconsistentes')
    }
    get nombre(): string | null { return this._nombre }
    get estado(): EstadoSuscriptor { return this._estado }
    get emailVerificadoEn(): Date | null { return this._emailVerificadoEn === null ? null : fechaCRM(this._emailVerificadoEn) }
    get creadoEn(): Date { return fechaCRM(this._creadoEn) }
    get actualizadoEn(): Date { return fechaCRM(this._actualizadoEn) }
    get eliminadoEn(): Date | null { return this._eliminadoEn === null ? null : fechaCRM(this._eliminadoEn) }
    private tocar(cuando: Date): void {
        if (this._eliminadoEn !== null) throw new Error('Suscriptor eliminado')
        const siguiente = fechaCRM(cuando)
        if (siguiente < this._actualizadoEn) throw new Error('La fecha retrocede')
        this._actualizadoEn = siguiente
    }
    editarNombre(nombre: string | null, cuando: Date): void {
        const nuevo = nombre === null ? null : textoCRM(nombre, 'Nombre')
        this.tocar(cuando); this._nombre = nuevo
    }
    confirmarEmail(cuando: Date): void {
        if (this._emailVerificadoEn !== null) throw new Error('Email ya verificado')
        if (this._estado === 'desuscrito') throw new Error('Suscriptor desuscrito')
        // El token de prueba se verifica en aplicación antes de invocar este método.
        this.tocar(cuando); this._emailVerificadoEn = fechaCRM(cuando)
    }
    inactivar(cuando: Date): void {
        if (this._estado !== 'activo') throw new Error('Solo se puede inactivar un suscriptor activo')
        this.tocar(cuando); this._estado = 'inactivo'
    }
    activar(cuando: Date): void {
        if (this._estado !== 'inactivo') throw new Error('Solo se puede activar un suscriptor inactivo')
        this.tocar(cuando); this._estado = 'activo'
    }
    desuscribir(cuando: Date): void {
        if (this._estado === 'desuscrito') return
        this.tocar(cuando); this._estado = 'desuscrito'
    }
    eliminar(cuando: Date): void {
        this.tocar(cuando); this._eliminadoEn = fechaCRM(cuando)
    }
}