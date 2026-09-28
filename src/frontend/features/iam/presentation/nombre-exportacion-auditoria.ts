type FechasAplicadas = { desde: string; hasta: string }
type Formato = 'csv' | 'xlsx'

export function nombreExportacionAuditoria(
    fechas: FechasAplicadas, accion: string, pagina: number, formato: Formato, hoy = new Date(),
): string {
    const local = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`
    const periodo = fechas.desde && fechas.hasta ? `${fechas.desde}_a_${fechas.hasta}`
        : fechas.desde ? `desde_${fechas.desde}` : fechas.hasta ? `hasta_${fechas.hasta}` : local
    const acciones: Record<string, string> = {
        Lectura: 'lectura', Creación: 'creacion', Edición: 'edicion', Eliminación: 'eliminacion',
    }
    return `auditoria-iam-${periodo}-${acciones[accion] ?? 'general'}-pagina-${pagina + 1}.${formato}`
}