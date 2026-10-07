import type {} from '@fastify/swagger'
export const idSchemaCms = { type: 'string', pattern: '^[1-9][0-9]{0,18}$' } as const
export const versionSchemaCms = { type: 'string', pattern: '^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3}Z$', format: 'date-time' } as const
export const textoSchemaCms = { type: 'string', maxLength: 65536 } as const
export const textoObligatorioSchemaCms = { type: 'string', minLength: 1, maxLength: 65536 } as const
// La unión de tipos evita que AJV coerce null a texto vacío.
export const textoNullableSchemaCms = { type: ['string', 'null'], maxLength: 65536 } as const
export const ordenSchemaCms = { type: 'integer', minimum: 0, maximum: 2147483647 } as const
export const destinoSchemaCms = { type: 'object', additionalProperties: false, required: ['tipo','id'], properties: {
  tipo: { type: 'string', enum: ['producto','industria','servicio'] }, id: idSchemaCms } } as const
export function objetoCms(properties: Record<string, unknown>) {
  return { type: 'object', additionalProperties: false, required: Object.keys(properties), properties }
}
export function nullableCms(schema: { type: string; [clave: string]: unknown }) { return { ...schema, type: [schema.type, 'null'] } }
export const paramsSchemaCms = objetoCms({ id: idSchemaCms })
export const errorSchemaCms = objetoCms({ error: { type: 'string' } })
export const erroresSchemaCms = Object.fromEntries([400,401,403,404,409,413,415,429,500].map(c => [c,errorSchemaCms]))
export const estadoSchemaCms = { type: 'string', enum: ['activo','inactivo','eliminado'] } as const
export const fechasSchemaCms = { creadoEn: versionSchemaCms, actualizadoEn: versionSchemaCms, eliminadoEn: nullableCms(versionSchemaCms) }
export function querySchemaCms(ids: readonly string[], configuracion = false) {
  const properties: Record<string, unknown> = { limite: { type: 'integer', minimum: 1, maximum: 200 }, desplazamiento: { type: 'integer', minimum: 0, maximum: 1000000 } }
  if (configuracion) Object.assign(properties, { clave: textoSchemaCms, grupo: textoSchemaCms, activo: { anyOf: [{ type: 'boolean' }, { type: 'string', const: 'sin-definir' }] } })
  else Object.assign(properties, { estado: estadoSchemaCms, incluirEliminados: { type: 'boolean' } })
  for (const id of ids) properties[id] = configuracion && id === 'empresaId' ? { anyOf: [idSchemaCms, { const: 'global', type: 'string' }] } : idSchemaCms
  return { type: 'object', additionalProperties: false, properties }
}
