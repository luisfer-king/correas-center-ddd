import type { EstadoIAM, FechasIAM } from './iam-values.js'
import { RegistroIAM, fecha, texto, uuid } from './iam-values.js'

// Entidad nueva: todavía no hay tabla sesiones en el export.
export class Sesion extends RegistroIAM {
    readonly id: string
    readonly usuarioId: string
    readonly expiraEn: Date
    #huellaToken: string
    private _revocadaEn: Date | null

    constructor(datos: {
        id: string; usuarioId: string; huellaToken: string; expiraEn: Date
        revocadaEn: Date | null; estado: EstadoIAM; fechas: FechasIAM
    }) {
        super(datos.estado, datos.fechas)
        this.id = uuid(datos.id)
        this.usuarioId = uuid(datos.usuarioId)
        this.#huellaToken = texto(datos.huellaToken, 'Huella de token')
        this.expiraEn = fecha(datos.expiraEn)
        this._revocadaEn = datos.revocadaEn ? fecha(datos.revocadaEn) : null
        if (this._revocadaEn && datos.estado === 'activo') throw new Error('Sesión revocada activa')
    }
    get revocadaEn(): Date | null { return this._revocadaEn ? fecha(this._revocadaEn) : null }
    get huellaTokenParaPersistencia(): string { return this.#huellaToken }
    estaVigente(ahora: Date): boolean {
        return this.estado === 'activo' && !this._revocadaEn && fecha(ahora) < this.expiraEn
    }
    revocar(cuando: Date): void {
        if (this._revocadaEn) return
        if (this.estado !== 'activo') throw new Error('Sesión no activa')
        this.inactivar(cuando)
        this._revocadaEn = fecha(cuando)
    }
}