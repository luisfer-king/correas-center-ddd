import { Email } from '../../../shared/domain/value-objects.js'
import type { EstadoIAM, FechasIAM } from './iam-values.js'
import { RegistroIAM, fecha, idPositivo, texto, uuid } from './iam-values.js'
import { UsuarioRol } from './usuario-rol.js'

export class Perfil extends RegistroIAM {
    readonly id: string
    private _nombreCompleto: string
    private _telefono: string | null
    private _avatarUrl: string | null
    private _email: Email | null
    private _emailVerifiedAt: Date | null
    private readonly roles = new Map<bigint, UsuarioRol>()

    constructor(datos: {
        id: string; nombreCompleto: string; telefono: string | null; avatarUrl: string | null
        email: Email | null; emailVerifiedAt: Date | null; estado: EstadoIAM; fechas: FechasIAM
        roles: readonly UsuarioRol[]
    }) {
        super(datos.estado, datos.fechas)
        this.id = uuid(datos.id)
        this._nombreCompleto = texto(datos.nombreCompleto, 'Nombre completo')
        this._telefono = datos.telefono
        this._avatarUrl = datos.avatarUrl
        this._email = datos.email
        this._emailVerifiedAt = datos.emailVerifiedAt ? fecha(datos.emailVerifiedAt) : null
        for (const asignacion of datos.roles) {
            if (asignacion.usuarioId !== this.id || this.roles.has(asignacion.rolId)) {
                throw new Error('Asignación de rol duplicada o de otro perfil')
            }
            this.roles.set(asignacion.rolId, asignacion)
        }
    }
    get nombreCompleto(): string { return this._nombreCompleto }
    get telefono(): string | null { return this._telefono }
    get avatarUrl(): string | null { return this._avatarUrl }
    get email(): Email | null { return this._email }
    get emailVerifiedAt(): Date | null { return this._emailVerifiedAt ? fecha(this._emailVerifiedAt) : null }
    get rolesAsignados(): readonly UsuarioRol[] { return [...this.roles.values()] }
    renombrar(nombre: string, cuando: Date): void {
        const nuevo = texto(nombre, 'Nombre completo')
        this.tocar(cuando)
        this._nombreCompleto = nuevo
    }
    actualizarContacto(telefono: string | null, avatarUrl: string | null, cuando: Date): void {
        this.tocar(cuando)
        this._telefono = telefono
        this._avatarUrl = avatarUrl
    }
    cambiarEmail(email: Email | null, cuando: Date): void {
        this.tocar(cuando)
        this._email = email
        this._emailVerifiedAt = null
    }
    marcarEmailVerificado(cuando: Date): void {
        if (!this._email) throw new Error('No hay email que verificar')
        this.tocar(cuando)
        this._emailVerifiedAt = fecha(cuando)
    }
    asignarRol(rolId: bigint, cuando: Date): void {
        if (this.estado !== 'activo') throw new Error('Perfil no activo')
        idPositivo(rolId)
        if (this.roles.has(rolId)) throw new Error('El perfil ya tiene el rol')
        this.tocar(cuando)
        this.roles.set(rolId, new UsuarioRol(this.id, rolId, cuando))
    }
    retirarRol(rolId: bigint, cuando: Date): void {
        if (!this.roles.has(rolId)) throw new Error('El perfil no tiene el rol')
        this.tocar(cuando)
        this.roles.delete(rolId)
    }
}