import type {} from '@fastify/cookie'
import type { FastifyInstance, FastifyRequest } from 'fastify'
import type { CasosIam } from '../../identity-access-management/infrastructure/componer-iam.js'
import { exigirSesion, exigirOrigen } from '../../identity-access-management/presentation/seguridad-http.js'
import type { SeguridadIam } from '../../identity-access-management/presentation/seguridad-http.js'
import type { ContextoAccionCms, RecursoCms } from '../application/seguridad-cms.js'
import type { CasosCms } from '../infrastructure/componer-cms.js'
const actores = new WeakMap<FastifyRequest, string>()
export type SesionCms = Pick<CasosIam, 'comprobar'>
export function seguridadHttpCms(app: FastifyInstance, iam: SesionCms, config: SeguridadIam): void {
  app.addHook('onRequest', async (req, reply) => {
    const actor = await exigirSesion(iam as CasosIam, config)(req, reply)
    if (!actor) return reply
    actores.set(req, actor)
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) return exigirOrigen(config)(req, reply)
  })
  // Comprobar claves antes de que AJV pueda retirar propiedades adicionales.
  app.addHook('preValidation', async req => {
    const schema = req.routeOptions.schema
    comprobarClaves(req.body, schema?.body)
    comprobarClaves(req.query, schema?.querystring)
  })
}
function comprobarClaves(valor: unknown, schema: unknown): void {
  if (!schema || typeof schema !== 'object' || !valor || typeof valor !== 'object' || Array.isArray(valor)) return
  const s = schema as { additionalProperties?: boolean; properties?: Record<string, unknown>; anyOf?: { type?: string }[] }
  if (s.anyOf) {
    const rama = s.anyOf.find(r => r.type === 'object')
    if (rama) comprobarClaves(valor, rama)
  }
  if (s.additionalProperties === false && s.properties) {
    for (const [clave, dato] of Object.entries(valor)) {
      if (!Object.hasOwn(s.properties, clave)) throw new Error('Solicitud CMS inválida')
      comprobarClaves(dato, s.properties[clave])
    }
  }
}
export function contextoHttpCms(req: FastifyRequest): ContextoAccionCms {
  const actorId = actores.get(req)
  if (!actorId) throw new Error('Sesión inválida')
  const userAgent = req.headers['user-agent']?.replace(/[\x00-\x1f\x7f]/g, '').slice(0, 2048) || null
  return { actorId, ipAddress: req.ip || null, userAgent }
}
export function idHttpCms(valor: unknown): bigint {
  if (typeof valor !== 'string' || !/^[1-9][0-9]{0,18}$/.test(valor)) throw new Error('ID CMS inválido')
  const id = BigInt(valor)
  if (id > 9223372036854775807n) throw new Error('ID CMS inválido')
  return id
}
export function idConfiguracionHttpCms(valor: unknown): number {
  const id = idHttpCms(valor)
  if (id > 2147483647n) throw new Error('ID CMS inválido')
  return Number(id)
}
export function versionHttpCms(valor: unknown): Date {
  if (typeof valor !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(valor)) throw new Error('Versión CMS inválida')
  const fecha = new Date(valor)
  if (!Number.isFinite(fecha.getTime()) || fecha.toISOString() !== valor) throw new Error('Versión CMS inválida')
  return fecha
}
export function cuerpoHttpCms(req: FastifyRequest): Record<string, unknown> { return req.body as Record<string, unknown> }
/** Frontera validada por los esquemas HTTP; convierte IDs sin tocar el JSON arbitrario de metadata. */
export function entradaHttpCms<T>(body: Record<string, unknown>, clavesId: readonly string[]): T {
  const salida = { ...body }; delete salida.version
  for (const clave of clavesId) if (salida[clave] !== null) salida[clave] = idHttpCms(salida[clave])
  if (Object.hasOwn(salida, 'destino') && salida.destino !== null) {
    const destino = salida.destino as { tipo: string; id: string }
    salida.destino = { tipo: destino.tipo, id: idHttpCms(destino.id) }
  }
  return salida as T
}
export function consultaHttpCms<T>(query: unknown, clavesId: readonly string[]): T {
  const q = { ...(query as Record<string, unknown>) }
  for (const clave of clavesId) if (q[clave] !== undefined) q[clave] = q[clave] === 'global' ? null : idHttpCms(q[clave])
  if (q.activo === 'sin-definir') q.activo = null
  return q as T
}
export async function leerHttpCms<T>(casos: CasosCms, req: FastifyRequest, recurso: RecursoCms | 'portal', tarea: () => Promise<T>, id: string | null = null): Promise<T> {
  const resultado = await tarea()
  // Si auditoría o la revalidación de permiso fallan, no se envía el resultado.
  await casos.registrarLectura.ejecutar(contextoHttpCms(req), recurso, id)
  return resultado
}
