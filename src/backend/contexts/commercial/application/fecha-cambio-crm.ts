import { fechaCRM } from '../domain/commercial-values.js'

export interface RelojCrm { ahora(): Date }

// La versión de PostgreSQL es timestamp; asegurar que cada modificación avance.
export function fechaCambioCrm(reloj: RelojCrm, anterior: Date): Date {
    const ahora = fechaCRM(reloj.ahora())
    const version = fechaCRM(anterior)
    return ahora > version ? ahora : new Date(version.getTime() + 1)
}
