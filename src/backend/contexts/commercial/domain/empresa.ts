import type { EstadoRegistroCRM, FechasCRM } from './commercial-values.js'
import { RegistroCRM, idCRM, textoCRM } from './commercial-values.js'

export class Empresa extends RegistroCRM {
    readonly id: bigint
    private _nombre: string
    private _logo: string | null
    constructor(d: { id: bigint; nombre: string; logo: string | null; estado: EstadoRegistroCRM; fechas: FechasCRM }) {
        super(d.estado, d.fechas)
        this.id = idCRM(d.id); this._nombre = textoCRM(d.nombre, 'Nombre de empresa'); this._logo = d.logo
    }
    get nombre(): string { return this._nombre }
    get logo(): string | null { return this._logo }
    editar(nombre: string, logo: string | null, cuando: Date): void {
        const nuevo = textoCRM(nombre, 'Nombre de empresa')
        this.tocar(cuando); this._nombre = nuevo; this._logo = logo
    }
}