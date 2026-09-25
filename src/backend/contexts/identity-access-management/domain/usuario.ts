import { Email } from '../../../shared/domain/value-objects.js'
import { HashArgon2id, uuid } from './iam-values.js'

export interface VerificadorClave {
    verificar(plaintext: string, hashArgon2id: string): Promise<boolean>
}

export class Usuario {
    readonly id: string
    private _email: Email
    #hash: HashArgon2id | null

    constructor(id: string, email: Email, encryptedPassword: HashArgon2id | null) {
        this.id = uuid(id)
        this._email = email
        this.#hash = encryptedPassword
    }
    get email(): Email { return this._email }
    get tieneClaveLocal(): boolean { return this.#hash !== null }
    cambiarEmail(email: Email): void { this._email = email }
    reemplazarHash(hash: HashArgon2id): void { this.#hash = hash }
    async verificarClave(plaintext: string, verificador: VerificadorClave): Promise<boolean> {
        if (!this.#hash) return false
        return verificador.verificar(plaintext, this.#hash.value)
    }
}