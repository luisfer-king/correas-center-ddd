import { createHash, timingSafeEqual } from 'node:crypto'
import type { HuellaToken } from '../application/ports/huella-token.js'

// SHA-256 solo para la huella de un JWT aleatorio; las contraseñas usan Argon2id.
export class Sha256HuellaToken implements HuellaToken {
    calcular(token: string): string { return createHash('sha256').update(token, 'utf8').digest('hex') }
    coincide(token: string, huella: string): boolean {
        if (!/^[0-9a-f]{64}$/.test(huella)) return false
        return timingSafeEqual(Buffer.from(this.calcular(token), 'hex'), Buffer.from(huella, 'hex'))
    }
}