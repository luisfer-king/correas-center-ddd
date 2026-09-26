import type { EventoAuditoriaIam } from '../api/tipos-iam'

export const columnasAuditoria = ['ID', 'Fecha (ISO)', 'Acción', 'Tabla', 'Registro', 'Actor', 'Operación',
    'IP', 'Agente de usuario', 'Datos anteriores (JSON)', 'Datos nuevos (JSON)', 'Metadatos (JSON)']

export function filasAuditoria(eventos: readonly EventoAuditoriaIam[]): string[][] {
    return eventos.map((evento) => {
        const operacion = evento.metadata && typeof evento.metadata === 'object' &&
            'operacion' in evento.metadata ? evento.metadata.operacion : null
        return [evento.id, evento.creadoEn, evento.accion, evento.tablaAfectada, evento.registroId,
        evento.usuarioId, operacion, evento.ipAddress, evento.userAgent,
        evento.datosAnteriores, evento.datosNuevos, evento.metadata]
            .map((valor) => valor == null ? '' : typeof valor === 'object' ? JSON.stringify(valor) : String(valor))
    })
}

function celda(cadena: string): string {
    // Evita que Excel interprete valores procedentes de la BD como fórmulas.
    const seguro = /^[\s\u0000-\u001f]*[=+\-@]/.test(cadena) ? `'${cadena}` : cadena
    return `"${seguro.replaceAll('"', '""')}"`
}

export function csvAuditoria(eventos: readonly EventoAuditoriaIam[]): string {
    const filas = filasAuditoria(eventos).map((fila) => fila.map(celda).join(';'))
    return `\uFEFF${[columnasAuditoria.map(celda).join(';'), ...filas].join('\r\n')}\r\n`
}