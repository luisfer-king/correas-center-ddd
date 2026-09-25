import { fecha, idPositivo, uuid } from './iam-values.js'

export class UsuarioRol {
    readonly usuarioId: string
    readonly rolId: bigint
    readonly creadoEn: Date
    constructor(usuarioId: string, rolId: bigint, creadoEn: Date) {
        this.usuarioId = uuid(usuarioId)
        this.rolId = idPositivo(rolId)
        this.creadoEn = fecha(creadoEn)
    }
    coincide(usuarioId: string, rolId: bigint): boolean {
        return this.usuarioId === uuid(usuarioId) && this.rolId === rolId
    }
}