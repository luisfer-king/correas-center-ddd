import { Email, Orden } from '../../../shared/domain/value-objects.js';
import type { EstadoRegistroCRM, FechasCRM } from './commercial-values.js';
import { RegistroCRM, Ubicacion, idCRM, textoCRM } from './commercial-values.js';

export type DatosSucursal = {
    nombre: string; direccion: string; telefono: string; email: Email | null
    horarios: string | null; mapaIncrustado: string | null; ubicacion: Ubicacion
}
export class Sucursal extends RegistroCRM {
    readonly id: bigint
    readonly empresaId: bigint
    private _datos: DatosSucursal
    private _esPrincipal: boolean
    private _orden: Orden
    constructor(d: { id: bigint; empresaId: bigint; datos: DatosSucursal; esPrincipal: boolean; orden: Orden; estado: EstadoRegistroCRM; fechas: FechasCRM }) {
        super(d.estado, d.fechas)
        this.id = idCRM(d.id); this.empresaId = idCRM(d.empresaId)
        this._datos = Sucursal.validarDatos(d.datos)
        if (typeof d.esPrincipal !== 'boolean') throw new Error('Indicador principal inválido')
        this._esPrincipal = d.esPrincipal; this._orden = d.orden
    }
    private static validarDatos(d: DatosSucursal): DatosSucursal {
        return {
            ...d, nombre: textoCRM(d.nombre, 'Nombre'), direccion: textoCRM(d.direccion, 'Dirección'),
            telefono: textoCRM(d.telefono, 'Teléfono'),
        }
    }
    get datos(): Readonly<DatosSucursal> { return { ...this._datos } }
    get esPrincipal(): boolean { return this._esPrincipal }
    get orden(): Orden { return this._orden }
    editar(datos: DatosSucursal, cuando: Date): void {
        const nuevos = Sucursal.validarDatos(datos)
        this.tocar(cuando); this._datos = nuevos
    }
    marcarPrincipal(cuando: Date): void { this.tocar(cuando); this._esPrincipal = true }
    quitarPrincipal(cuando: Date): void { this.tocar(cuando); this._esPrincipal = false }
    reordenar(orden: Orden, cuando: Date): void { this.tocar(cuando); this._orden = orden }
}