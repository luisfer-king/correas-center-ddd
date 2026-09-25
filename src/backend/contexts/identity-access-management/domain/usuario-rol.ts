import type { EstadoAsignacion } from './iam-values.js'
import { fecha, idPositivo, uuid } from './iam-values.js'

export class UsuarioRol {
    readonly usuarioId: string
    readonly rolId: bigint
    readonly creadoEn: Date
    private _estado: EstadoAsignacion
    constructor(usuarioId: string, rolId: bigint, creadoEn: Date, estado: EstadoAsignacion = 'activo') {
        if (estado !== 'activo' && estado !== 'inactivo') throw new Error('Estado de asignación inválido')
        this.usuarioId = uuid(usuarioId)
        this.rolId = idPositivo(rolId)
        this.creadoEn = fecha(creadoEn)
        this._estado = estado
    }
    get estado(): EstadoAsignacion { return this._estado }
    activar(): void {
        if (this._estado !== 'inactivo') throw new Error('El rol ya está activo para este usuario')
        this._estado = 'activo'
    }
    inactivar(): void {
        if (this._estado !== 'activo') throw new Error('El rol ya está inactivo para este usuario')
        this._estado = 'inactivo'
    }
    coincide(usuarioId: string, rolId: bigint): boolean {
        return this.usuarioId === uuid(usuarioId) && this.rolId === rolId
    }
}