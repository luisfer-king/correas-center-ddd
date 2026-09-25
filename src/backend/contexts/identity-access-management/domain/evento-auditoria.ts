import type { AccionAuditoria, Json } from './iam-values.js'
import { fecha, idPositivo, texto, uuid } from './iam-values.js'

function sinSecretos(value: Json, seen = new WeakSet<object>()): void {
    if (value === null || typeof value !== 'object') return
    if (seen.has(value)) throw new Error('JSON circular no permitido')
    seen.add(value)
    for (const [key, child] of Object.entries(value)) {
        if (/password|contrase(?:n|ñ)a|token|secret|authorization|cookie|hash/i.test(key)) {
            throw new Error('Dato sensible no permitido en auditoría')
        }
        sinSecretos(child, seen)
    }
    seen.delete(value)
}

export type DatosAuditoria = {
    id: bigint | null; usuarioId: string | null; accion: AccionAuditoria
    tablaAfectada: string; registroId: string | null; datosAnteriores: Json
    datosNuevos: Json; ipAddress: string | null; userAgent: string | null
    metadata: Json; creadoEn: Date
}

export class EventoAuditoria {
    readonly id: bigint | null // null antes del INSERT; la BD asigna el bigint.
    readonly usuarioId: string | null
    readonly accion: AccionAuditoria
    readonly tablaAfectada: string
    readonly registroId: string | null
    readonly ipAddress: string | null
    readonly userAgent: string | null
    private readonly _datosAnteriores: Json
    private readonly _datosNuevos: Json
    private readonly _metadata: Json
    private readonly _creadoEn: Date

    private constructor(datos: DatosAuditoria, nuevo: boolean) {
        this.id = datos.id === null ? null : idPositivo(datos.id)
        this.usuarioId = datos.usuarioId === null ? null : uuid(datos.usuarioId)
        if (!['Lectura', 'Creación', 'Edición', 'Eliminación'].includes(datos.accion)) {
            throw new Error('Acción de auditoría inválida')
        }
        this.accion = datos.accion
        this.tablaAfectada = texto(datos.tablaAfectada, 'Tabla afectada')
        this.registroId = datos.registroId
        this.ipAddress = datos.ipAddress
        this.userAgent = datos.userAgent
        if (nuevo) {
            sinSecretos(datos.datosAnteriores)
            sinSecretos(datos.datosNuevos)
            sinSecretos(datos.metadata)
        }
        this._datosAnteriores = structuredClone(datos.datosAnteriores)
        this._datosNuevos = structuredClone(datos.datosNuevos)
        this._metadata = structuredClone(datos.metadata)
        this._creadoEn = fecha(datos.creadoEn)
    }
    static registrar(datos: Omit<DatosAuditoria, 'id'>): EventoAuditoria {
        return new EventoAuditoria({ ...datos, id: null }, true)
    }
    static rehidratar(datos: DatosAuditoria): EventoAuditoria {
        return new EventoAuditoria(datos, false)
    }
    get creadoEn(): Date { return fecha(this._creadoEn) }
    get datosAnteriores(): Json { return structuredClone(this._datosAnteriores) }
    get datosNuevos(): Json { return structuredClone(this._datosNuevos) }
    get metadata(): Json { return structuredClone(this._metadata) }
    correspondeA(tabla: string, registro: string | null): boolean {
        return this.tablaAfectada === tabla && this.registroId === registro
    }
}