import { Slug } from '../../../shared/domain/value-objects.js'
import type { EstadoIAM, FechasIAM } from './iam-values.js'
import { RegistroIAM, idPositivo, texto } from './iam-values.js'
import { RolPermiso } from './rol-permiso.js'

export class Rol extends RegistroIAM {
    readonly id: bigint
    readonly slug: Slug
    readonly esSistema: boolean
    private _nombre: string
    private _descripcion: string | null
    private readonly permisos = new Map<bigint, RolPermiso>()

    constructor(datos: {
        id: bigint; nombre: string; slug: Slug; descripcion: string | null
        esSistema: boolean; estado: EstadoIAM; fechas: FechasIAM
        permisos: readonly RolPermiso[]
    }) {
        super(datos.estado, datos.fechas)
        this.id = idPositivo(datos.id)
        this._nombre = texto(datos.nombre, 'Nombre de rol')
        this.slug = datos.slug
        this._descripcion = datos.descripcion
        this.esSistema = datos.esSistema
        for (const asignacion of datos.permisos) {
            if (asignacion.rolId !== this.id || this.permisos.has(asignacion.permisoId)) {
                throw new Error('Asignación de permiso duplicada o de otro rol')
            }
            this.permisos.set(asignacion.permisoId, asignacion)
        }
    }
    get nombre(): string { return this._nombre }
    get descripcion(): string | null { return this._descripcion }
    get permisosAsignados(): readonly RolPermiso[] { return [...this.permisos.values()].filter((v) => v.estado === 'activo') }
    get asignacionesPermisos(): readonly RolPermiso[] { return [...this.permisos.values()] }
    editar(nombre: string, descripcion: string | null, cuando: Date): void {
        const nuevo = texto(nombre, 'Nombre de rol')
        this.tocar(cuando)
        this._nombre = nuevo
        this._descripcion = descripcion
    }
    asignarPermiso(permisoId: bigint, cuando: Date): void {
        if (this.estado !== 'activo') throw new Error('Rol no activo')
        idPositivo(permisoId)
        const asignacion = this.permisos.get(permisoId)
        if (asignacion?.estado === 'activo') throw new Error('Permiso ya asignado')
        this.tocar(cuando)
        if (asignacion) asignacion.activar()
        else this.permisos.set(permisoId, new RolPermiso(this.id, permisoId, cuando))
    }
    retirarPermiso(permisoId: bigint, cuando: Date): void {
        const asignacion = this.permisos.get(permisoId)
        if (!asignacion || asignacion.estado !== 'activo') throw new Error('Permiso no asignado')
        this.tocar(cuando)
        asignacion.inactivar()
    }
    override inactivar(cuando: Date): void {
        if (this.esSistema) throw new Error('Rol del sistema protegido')
        super.inactivar(cuando)
    }
    override eliminar(cuando: Date): void {
        if (this.esSistema) throw new Error('Rol del sistema protegido')
        super.eliminar(cuando)
    }
}