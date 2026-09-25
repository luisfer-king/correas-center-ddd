import type { EstadoAsignacion } from './iam-values.js'
import { fecha, idPositivo } from './iam-values.js'

export class RolPermiso {
    readonly rolId: bigint
    readonly permisoId: bigint
    readonly creadoEn: Date
    private _estado: EstadoAsignacion
    constructor(rolId: bigint, permisoId: bigint, creadoEn: Date, estado: EstadoAsignacion = 'activo') {
        if (estado !== 'activo' && estado !== 'inactivo') throw new Error('Estado de asignación inválido')
        this.rolId = idPositivo(rolId)
        this.permisoId = idPositivo(permisoId)
        this.creadoEn = fecha(creadoEn)
        this._estado = estado
    }
    get estado(): EstadoAsignacion { return this._estado }
    activar(): void {
        if (this._estado !== 'inactivo') throw new Error('El permiso ya está activo')
        this._estado = 'activo'
    }
    inactivar(): void {
        if (this._estado !== 'activo') throw new Error('El permiso ya está inactivo')
        this._estado = 'inactivo'
    }
    coincide(rolId: bigint, permisoId: bigint): boolean {
        return this.rolId === rolId && this.permisoId === permisoId
    }
}