import { Email } from '../../../shared/domain/value-objects.js'
import type { FechasCRM } from './commercial-values.js'
import { fechaCRM, idCRM, textoCRM } from './commercial-values.js'

export type EstadoContacto = 'nuevo' | 'respondido' | 'archivado'
export class ContactoEntrante {
    readonly id: bigint
    readonly empresaId: bigint
    readonly nombre: string
    readonly empresaDeclarada: string | null
    readonly telefono: string
    readonly email: Email
    readonly mensaje: string
    private _estado: EstadoContacto
    private readonly _creadoEn: Date
    private _actualizadoEn: Date
    private _eliminadoEn: Date | null

    constructor(d: { id: bigint; empresaId: bigint; nombre: string; empresaDeclarada: string | null; telefono: string; email: Email; mensaje: string; estado: EstadoContacto; fechas: FechasCRM }) {
        if (!['nuevo', 'respondido', 'archivado'].includes(d.estado)) throw new Error('Estado de contacto inválido')
        this.id = idCRM(d.id); this.empresaId = idCRM(d.empresaId)
        this.nombre = textoCRM(d.nombre, 'Nombre'); this.empresaDeclarada = d.empresaDeclarada
        this.telefono = textoCRM(d.telefono, 'Teléfono'); this.email = d.email
        this.mensaje = textoCRM(d.mensaje, 'Mensaje'); this._estado = d.estado
        this._creadoEn = fechaCRM(d.fechas.creadoEn)
        this._actualizadoEn = fechaCRM(d.fechas.actualizadoEn)
        this._eliminadoEn = d.fechas.eliminadoEn === null ? null : fechaCRM(d.fechas.eliminadoEn)
        if (this._actualizadoEn < this._creadoEn || (this._eliminadoEn !== null && this._eliminadoEn < this._actualizadoEn)) throw new Error('Fechas inconsistentes')
    }
    get estado(): EstadoContacto { return this._estado }
    get creadoEn(): Date { return fechaCRM(this._creadoEn) }
    get actualizadoEn(): Date { return fechaCRM(this._actualizadoEn) }
    get eliminadoEn(): Date | null { return this._eliminadoEn === null ? null : fechaCRM(this._eliminadoEn) }
    private tocar(cuando: Date): void {
        if (this._eliminadoEn !== null) throw new Error('Contacto eliminado')
        const siguiente = fechaCRM(cuando)
        if (siguiente < this._actualizadoEn) throw new Error('La fecha retrocede')
        this._actualizadoEn = siguiente
    }
    marcarRespondido(cuando: Date): void {
        if (this._estado !== 'nuevo') throw new Error('Solo puede responderse un contacto nuevo')
        this.tocar(cuando); this._estado = 'respondido'
    }
    archivar(cuando: Date): void {
        if (this._estado === 'archivado') throw new Error('Contacto ya archivado')
        this.tocar(cuando); this._estado = 'archivado'
    }
    eliminar(cuando: Date): void {
        this.tocar(cuando); this._eliminadoEn = fechaCRM(cuando)
    }
}