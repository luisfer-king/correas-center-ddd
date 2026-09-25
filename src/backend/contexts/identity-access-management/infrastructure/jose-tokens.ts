import { SignJWT, jwtVerify } from 'jose'
import type { DatosToken, ServicioTokens } from '../application/ports/servicio-tokens.js'
import { uuid } from '../domain/iam-values.js'

export class JoseTokens implements ServicioTokens {
    private readonly clave: Uint8Array
    constructor(secretB64Url: string, private readonly issuer: string, private readonly audience: string) {
        const clave = Buffer.from(secretB64Url, 'base64url')
        if (clave.length < 32 || clave.toString('base64url') !== secretB64Url) {
            throw new Error('IAM_JWT_SECRET_B64 requiere al menos 32 bytes aleatorios en base64url')
        }
        if (!issuer || !audience) throw new Error('Emisor y audiencia JWT obligatorios')
        this.clave = clave
    }
    async emitir(datos: DatosToken): Promise<string> {
        const iat = Math.floor(datos.emitidoEn.getTime() / 1000)
        const exp = Math.floor(datos.expiraEn.getTime() / 1000)
        if (!Number.isSafeInteger(iat) || !Number.isSafeInteger(exp) || exp <= iat || exp - iat > 900) {
            throw new Error('Duración de sesión inválida')
        }
        return new SignJWT({})
            .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
            .setSubject(uuid(datos.usuarioId))
            .setJti(uuid(datos.sesionId))
            .setIssuer(this.issuer)
            .setAudience(this.audience)
            .setIssuedAt(iat)
            .setExpirationTime(exp)
            .sign(this.clave)
    }
    async verificar(jwt: string): Promise<DatosToken> {
        if (typeof jwt !== 'string' || jwt.length > 8192 || !jwt) throw new Error('Sesión inválida')
        const { payload, protectedHeader } = await jwtVerify(jwt, this.clave, {
            issuer: this.issuer, audience: this.audience, algorithms: ['HS256'],
        })
        if (protectedHeader.typ !== 'JWT' || typeof payload.sub !== 'string' ||
            typeof payload.jti !== 'string' || !Number.isSafeInteger(payload.iat) ||
            !Number.isSafeInteger(payload.exp) || (payload.exp as number) - (payload.iat as number) > 900) {
            throw new Error('Sesión inválida')
        }
        return {
            usuarioId: uuid(payload.sub), sesionId: uuid(payload.jti),
            emitidoEn: new Date((payload.iat as number) * 1000),
            expiraEn: new Date((payload.exp as number) * 1000),
        }
    }
}