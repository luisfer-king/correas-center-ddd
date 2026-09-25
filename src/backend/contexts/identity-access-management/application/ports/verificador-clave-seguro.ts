import type { VerificadorClave } from '../../domain/usuario.js'
export interface VerificadorClaveSeguro extends VerificadorClave {
    verificarAusente(plaintext: string): Promise<void>
}