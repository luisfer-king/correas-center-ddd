import { fecha, idPositivo } from './iam-values.js'

export class RolPermiso {
    readonly rolId: bigint
    readonly permisoId: bigint
    readonly creadoEn: Date
    constructor(rolId: bigint, permisoId: bigint, creadoEn: Date) {
        this.rolId = idPositivo(rolId)
        this.permisoId = idPositivo(permisoId)
        this.creadoEn = fecha(creadoEn)
    }
    coincide(rolId: bigint, permisoId: bigint): boolean {
        return this.rolId === rolId && this.permisoId === permisoId
    }
}