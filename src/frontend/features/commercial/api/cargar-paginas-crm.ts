export async function cargarPaginasCrm<T extends { id: string }>(
    listar: (pagina: number, opciones: { signal: AbortSignal }) => Promise<T[]>, signal: AbortSignal,
): Promise<T[]> {
    const resultados = new Map<string, T>()
    for (let pagina = 1; pagina <= 10000; pagina++) {
        signal.throwIfAborted()
        const lote = await listar(pagina, { signal })
        signal.throwIfAborted()
        for (const fila of lote) resultados.set(fila.id, fila)
        if (lote.length < 100) return [...resultados.values()]
    }
    throw new Error('El listado supera el límite de consulta. Reduce los registros antes de continuar.')
}
