import { Prisma, type PrismaClient } from '../../../generated/prisma/client.js'
import type { RepositorioAuditoria } from '../application/ports/repositorio-auditoria.js'
import { EventoAuditoria } from '../domain/evento-auditoria.js'
import type { AccionAuditoria, Json } from '../domain/iam-values.js'
import { insertarAuditoria } from './insertar-auditoria.js'

export class PrismaAuditoria implements RepositorioAuditoria {
    constructor(private readonly db: PrismaClient) { }
    async registrar(evento: EventoAuditoria): Promise<void> {
        await this.db.$transaction((tx) => insertarAuditoria(tx, evento))
    }
    async listar(limite: number, antesDeId: bigint | null): Promise<readonly EventoAuditoria[]> {
        if (!Number.isSafeInteger(limite) || limite < 1 || limite > 100) throw new Error('Límite inválido')
        if (antesDeId !== null && antesDeId <= 0n) throw new Error('Cursor inválido')
        type Fila = {
            id: bigint; usuarioId: string | null; accion: AccionAuditoria
            tablaAfectada: string; registroId: string | null
            datosAnteriores: Json; datosNuevos: Json; ipAddress: string | null
            userAgent: string | null; metadata: Json; creadoEn: Date
        }
        const cursor = antesDeId === null ? Prisma.empty : Prisma.sql`WHERE id < ${antesDeId}`
        // accion::text evita la conversión de enums con @map y tilde al leer.
        const filas = await this.db.$queryRaw<Fila[]>(Prisma.sql`
            SELECT id, usuario_id AS "usuarioId", accion::text AS accion,
                tabla_afectada AS "tablaAfectada", registro_id AS "registroId",
                datos_anteriores AS "datosAnteriores", datos_nuevos AS "datosNuevos",
                ip_address AS "ipAddress", user_agent AS "userAgent",
                metadata, creado_en AS "creadoEn"
            FROM public.auditoria ${cursor} ORDER BY id DESC LIMIT ${limite}`)
        return filas.map((f) => EventoAuditoria.rehidratar({
            id: f.id, usuarioId: f.usuarioId,
            accion: f.accion,
            tablaAfectada: f.tablaAfectada, registroId: f.registroId,
            datosAnteriores: (f.datosAnteriores ?? null) as Json,
            datosNuevos: (f.datosNuevos ?? null) as Json,
            ipAddress: f.ipAddress, userAgent: f.userAgent,
            metadata: (f.metadata ?? {}) as Json, creadoEn: f.creadoEn,
        }))
    }
}