import type { EventoAuditoriaIam } from '../api/tipos-iam'

const columnas = ['ID', 'Fecha (ISO)', 'Acción', 'Tabla', 'Registro', 'Actor', 'Operación',
    'IP', 'Agente de usuario', 'Datos anteriores (JSON)', 'Datos nuevos (JSON)', 'Metadatos (JSON)']

function celda(valor: unknown): string {
    const cadena = valor == null ? '' : typeof valor === 'object' ? JSON.stringify(valor) : String(valor)
    // Evita que Excel interprete valores procedentes de la BD como fórmulas.
    const seguro = /^[\s\u0000-\u001f]*[=+\-@]/.test(cadena) ? `'${cadena}` : cadena
    return `"${seguro.replaceAll('"', '""')}"`
}

export function csvAuditoria(eventos: readonly EventoAuditoriaIam[]): string {
    const filas = eventos.map((evento) => {
        const operacion = evento.metadata && typeof evento.metadata === 'object' &&
            'operacion' in evento.metadata ? evento.metadata.operacion : null
        return [evento.id, evento.creadoEn, evento.accion, evento.tablaAfectada, evento.registroId,
        evento.usuarioId, operacion, evento.ipAddress, evento.userAgent,
        evento.datosAnteriores, evento.datosNuevos, evento.metadata].map(celda).join(';')
    })
    return `\uFEFF${[columnas.map(celda).join(';'), ...filas].join('\r\n')}\r\n`
}