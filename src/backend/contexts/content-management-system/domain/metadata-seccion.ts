export type JsonCMS = null | boolean | number | string | JsonCMS[] | { [key: string]: JsonCMS }
export type MetadataSeccion = Readonly<Record<string, JsonCMS>>

function jsonValido(value: unknown, seen = new WeakSet<object>()): value is JsonCMS {
    if (value === null || typeof value === 'string' || typeof value === 'boolean') return true
    if (typeof value === 'number') return Number.isFinite(value)
    if (typeof value !== 'object' || value instanceof Date || seen.has(value)) return false
    if (!Array.isArray(value) && Object.getPrototypeOf(value) !== Object.prototype && Object.getPrototypeOf(value) !== null) return false
    seen.add(value)
    const ok = Array.isArray(value)
        ? value.every((item) => jsonValido(item, seen))
        : Object.entries(value).every(([key, item]) => !['__proto__', 'constructor', 'prototype'].includes(key) && jsonValido(item, seen))
    seen.delete(value)
    return ok
}

export function camposMetadata(value: unknown): readonly string[] {
    if (!Array.isArray(value) || !value.every((key) => typeof key === 'string' && key.trim() && key === key.trim())) throw new Error('Claves de metadata inválidas')
    if (new Set(value).size !== value.length) throw new Error('Claves de metadata duplicadas')
    return Object.freeze([...value])
}
export function metadataSeccion(value: unknown): MetadataSeccion {
    if (value === null || Array.isArray(value) || typeof value !== 'object' || !jsonValido(value)) throw new Error('Metadata debe ser un objeto JSON')
    return structuredClone(value) as MetadataSeccion
}
export function validarMetadataSeccion(campos: readonly string[], metadata: unknown): MetadataSeccion {
    const resultado = metadataSeccion(metadata)
    const permitidas = new Set(camposMetadata(campos))
    if (Object.keys(resultado).some((key) => !permitidas.has(key))) throw new Error('Metadata contiene claves no declaradas')
    return resultado
}