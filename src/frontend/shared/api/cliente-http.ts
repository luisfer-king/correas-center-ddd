export class ErrorApi extends Error {
    readonly estado: number

    constructor(estado: number, message: string) {
        super(message)
        this.name = 'ErrorApi'
        this.estado = estado
    }
}

type Metodo = 'GET' | 'POST' | 'PATCH' | 'PUT'
interface Opciones { metodo?: Metodo; cuerpo?: unknown; signal?: AbortSignal }

export async function solicitarApi<T>(ruta: string, opciones: Opciones = {}): Promise<T> {
    if (!ruta.startsWith('/api/') || ruta.startsWith('//')) throw new Error('Ruta de API inválida')
    const metodo = opciones.metodo ?? 'GET'
    const headers = new Headers({ Accept: 'application/json' })
    if (metodo !== 'GET') headers.set('X-Portal-Request', '1')
    if (opciones.cuerpo !== undefined) headers.set('Content-Type', 'application/json')

    const respuesta = await fetch(ruta, {
        method: metodo,
        credentials: 'same-origin',
        headers,
        signal: opciones.signal,
        body: opciones.cuerpo === undefined ? undefined : JSON.stringify(opciones.cuerpo),
    })
    const esJson = respuesta.headers.get('content-type')?.includes('application/json') ?? false
    let contenido: unknown
    if (respuesta.status !== 204 && esJson) {
        try { contenido = await respuesta.json() } catch { /* respuesta JSON inválida */ }
    }
    if (!respuesta.ok) {
        const detalle = contenido && typeof contenido === 'object' && 'error' in contenido
            ? (contenido as { error?: unknown }).error : undefined
        throw new ErrorApi(respuesta.status,
            typeof detalle === 'string' ? detalle : `La solicitud falló (${respuesta.status})`)
    }
    if (respuesta.status === 204) return undefined as T
    if (!esJson || contenido === undefined) throw new ErrorApi(respuesta.status, 'Respuesta de API inválida')
    return contenido as T
}