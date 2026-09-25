import { Slug } from '../../../shared/domain/value-objects.js'
import type { EstadoIAM, FechasIAM } from './iam-values.js'
import { RegistroIAM, idPositivo, texto } from './iam-values.js'

export class Permiso extends RegistroIAM {
    readonly id: bigint
    readonly slug: Slug
    private _nombre: string
    private _grupo: string
    private _descripcion: string | null
    constructor(datos: {
        id: bigint; nombre: string; slug: Slug; grupo: string; descripcion: string | null
        estado: EstadoIAM; fechas: FechasIAM
    }) {
        super(datos.estado, datos.fechas)
        this.id = idPositivo(datos.id)
        this.slug = datos.slug
        this._nombre = texto(datos.nombre, 'Nombre de permiso')
        this._grupo = texto(datos.grupo, 'Grupo de permiso')
        this._descripcion = datos.descripcion
    }
    get nombre(): string { return this._nombre }
    get grupo(): string { return this._grupo }
    get descripcion(): string | null { return this._descripcion }
    editar(nombre: string, grupo: string, descripcion: string | null, cuando: Date): void {
        const nombreNuevo = texto(nombre, 'Nombre de permiso')
        const grupoNuevo = texto(grupo, 'Grupo de permiso')
        this.tocar(cuando)
        this._nombre = nombreNuevo
        this._grupo = grupoNuevo
        this._descripcion = descripcion
    }
}