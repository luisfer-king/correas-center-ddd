import { fechaCRM, idCRM } from './commercial-values.js'
import { ContactoEntrante } from './contacto-entrante.js'

export type EstadoLead = 'nuevo' | 'calificado' | 'descartado'
function uuidLead(value: string): string {
    if (typeof value !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)) throw new Error('UUID de Lead inválido')
    return value.toLowerCase()
}

// Entidad nueva: no existe tabla Lead en el SQL antiguo. Identidad, etapas y
// persistencia son decisiones propuestas, pendientes de confirmar antes de Prisma.
export class Lead {
    readonly id: string
    readonly empresaId: bigint
    readonly contactoId: bigint | null
    private _estado: EstadoLead
    private _responsableId: string | null
    private readonly _creadoEn: Date
    private _actualizadoEn: Date
    private _eliminadoEn: Date | null

    constructor(d: { id: string; empresaId: bigint; contactoId: bigint | null; estado: EstadoLead; responsableId: string | null; creadoEn: Date; actualizadoEn: Date; eliminadoEn: Date | null }) {
        if (!['nuevo', 'calificado', 'descartado'].includes(d.estado)) throw new Error('Estado de Lead inválido')
        this.id = uuidLead(d.id); this.empresaId = idCRM(d.empresaId)
        this.contactoId = d.contactoId === null ? null : idCRM(d.contactoId)
        this._responsableId = d.responsableId === null ? null : uuidLead(d.responsableId)
        this._estado = d.estado
        this._creadoEn = fechaCRM(d.creadoEn); this._actualizadoEn = fechaCRM(d.actualizadoEn)
        this._eliminadoEn = d.eliminadoEn === null ? null : fechaCRM(d.eliminadoEn)
        if (this._actualizadoEn < this._creadoEn || (this._eliminadoEn !== null && this._eliminadoEn < this._actualizadoEn)) throw new Error('Fechas inconsistentes')
    }
    static desdeContacto(id: string, contacto: ContactoEntrante, cuando: Date): Lead {
        if (contacto.eliminadoEn !== null) throw new Error('Contacto eliminado')
        return new Lead({ id, empresaId: contacto.empresaId, contactoId: contacto.id, estado: 'nuevo', responsableId: null, creadoEn: cuando, actualizadoEn: cuando, eliminadoEn: null })
    }
    get estado(): EstadoLead { return this._estado }
    get responsableId(): string | null { return this._responsableId }
    get creadoEn(): Date { return fechaCRM(this._creadoEn) }
    get actualizadoEn(): Date { return fechaCRM(this._actualizadoEn) }
    get eliminadoEn(): Date | null { return this._eliminadoEn === null ? null : fechaCRM(this._eliminadoEn) }
    private tocar(cuando: Date): void {
        if (this._eliminadoEn !== null) throw new Error('Lead eliminado')
        const siguiente = fechaCRM(cuando)
        if (siguiente < this._actualizadoEn) throw new Error('La fecha retrocede')
        this._actualizadoEn = siguiente
    }
    asignarResponsable(usuarioId: string | null, cuando: Date): void {
        const nuevo = usuarioId === null ? null : uuidLead(usuarioId)
        this.tocar(cuando); this._responsableId = nuevo
    }
    calificar(cuando: Date): void {
        if (this._estado !== 'nuevo') throw new Error('Lead no disponible para calificar')
        this.tocar(cuando); this._estado = 'calificado'
    }
    descartar(cuando: Date): void {
        if (this._estado !== 'nuevo') throw new Error('Lead no disponible para descartar')
        this.tocar(cuando); this._estado = 'descartado'
    }
    eliminar(cuando: Date): void {
        this.tocar(cuando); this._eliminadoEn = fechaCRM(cuando)
    }
}