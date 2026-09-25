import { argon2id, hash, verify } from 'argon2'
import { randomBytes } from 'node:crypto'
import type { VerificadorClaveSeguro } from '../application/ports/verificador-clave-seguro.js'

export class Argon2Verificador implements VerificadorClaveSeguro {
    // Una comprobación Argon2id también para emails ausentes, sin cuenta real.
    private readonly hashFicticio = hash(randomBytes(32).toString('hex'), {
        type: argon2id, memoryCost: 19456, timeCost: 2, parallelism: 1,
    })
    async verificar(plaintext: string, hashArgon2id: string): Promise<boolean> {
        if (!hashArgon2id.startsWith('$argon2id$')) return false
        try { return await verify(hashArgon2id, plaintext) }
        catch { return false }
    }
    async verificarAusente(plaintext: string): Promise<void> {
        await verify(await this.hashFicticio, plaintext)
    }
}