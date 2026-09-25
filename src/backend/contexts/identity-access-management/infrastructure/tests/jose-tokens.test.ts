import assert from 'node:assert/strict'
import { randomBytes } from 'node:crypto'
import { test } from 'node:test'
import { JoseTokens } from '../jose-tokens.js'

const issuer = 'correas-center-local'
const audience = 'correas-center-api'
const usuarioId = '11111111-1111-4111-8111-111111111111'
const sesionId = '22222222-2222-4222-8222-222222222222'

test('JWT firmado: rechaza alteración, emisor distinto, expiración y clave corta', async () => {
    const clave = randomBytes(32).toString('base64url')
    const tokens = new JoseTokens(clave, issuer, audience)
    const ahora = new Date()
    const datos = { usuarioId, sesionId, emitidoEn: ahora, expiraEn: new Date(ahora.getTime() + 900_000) }
    const token = await tokens.emitir(datos)
    assert.equal((await tokens.verificar(token)).usuarioId, usuarioId)
    const partes = token.split('.')
    partes[2] = (partes[2][0] === 'a' ? 'b' : 'a') + partes[2].slice(1)
    await assert.rejects(tokens.verificar(partes.join('.')))
    await assert.rejects(new JoseTokens(clave, 'otro-emisor', audience).verificar(token))
    const vencido = await tokens.emitir({
        ...datos,
        emitidoEn: new Date(ahora.getTime() - 1_200_000),
        expiraEn: new Date(ahora.getTime() - 300_000),
    })
    await assert.rejects(tokens.verificar(vencido))
    assert.throws(() => new JoseTokens(randomBytes(16).toString('base64url'), issuer, audience))
})