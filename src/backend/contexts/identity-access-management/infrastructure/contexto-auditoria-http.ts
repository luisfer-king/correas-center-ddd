import { AsyncLocalStorage } from 'node:async_hooks';

export type ContextoAuditoriaHttp = { ipAddress: string | null; userAgent: string | null }

const solicitudes = new AsyncLocalStorage<ContextoAuditoriaHttp>()

export function conContextoAuditoriaHttp<T>(contexto: ContextoAuditoriaHttp, ejecutar: () => T): T {
    return solicitudes.run(contexto, ejecutar)
}

export function contextoAuditoriaHttp(): ContextoAuditoriaHttp | undefined {
    return solicitudes.getStore()
}