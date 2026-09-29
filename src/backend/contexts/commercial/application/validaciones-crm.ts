import { textoCRM } from '../domain/commercial-values.js'

export function textoOpcionalCrm(valor: string | null, campo: string, maximo = 2048): string | null {
    if (valor === null) return null
    const limpio = textoCRM(valor, campo)
    if (limpio.length > maximo) throw new Error(`${campo} demasiado largo`)
    return limpio
}

export function logoCrm(valor: string | null): string | null {
    return textoOpcionalCrm(valor, 'Logo')
}
