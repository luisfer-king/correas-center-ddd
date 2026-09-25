import { fecha } from '../domain/iam-values.js'
import type { Reloj } from './ports/reloj.js'

// @updatedAt es Date (ms). Garantiza versión nueva incluso con dos cambios en el mismo ms.
export function fechaCambio(reloj: Reloj, versionAnterior: Date): Date {
    const ahora = fecha(reloj.ahora())
    const anterior = fecha(versionAnterior)
    if (ahora > anterior) return ahora
    return new Date(anterior.getTime() + 1)
}