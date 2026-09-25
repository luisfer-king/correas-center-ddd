import type { Prisma } from '../../../generated/prisma/client.js'
import type { EventoAuditoria } from '../domain/evento-auditoria.js'

// Query parametrizada: los valores del enum con tilde se envían con su valor SQL real.
// Mantener en la misma transacción que el cambio auditado.
export async function insertarAuditoria(tx: Prisma.TransactionClient, evento: EventoAuditoria): Promise<void> {
    await tx.$executeRaw`
    INSERT INTO public.auditoria
        (usuario_id, accion, tabla_afectada, registro_id, datos_anteriores,
        datos_nuevos, ip_address, user_agent, metadata, creado_en)
    VALUES
        (${evento.usuarioId}::uuid, ${evento.accion}::public.enum_accion_auditoria,
        ${evento.tablaAfectada}, ${evento.registroId},
        ${JSON.stringify(evento.datosAnteriores)}::jsonb, ${JSON.stringify(evento.datosNuevos)}::jsonb,
        ${evento.ipAddress}, ${evento.userAgent}, ${JSON.stringify(evento.metadata)}::jsonb,
        ${evento.creadoEn})`
}