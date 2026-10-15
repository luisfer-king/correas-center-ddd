interface EntradaCache { promise: Promise<unknown>; vence: number }
const cache = new Map<string, EntradaCache>()
const TTL = 15_000
export function invalidarCachePublica(clave?: string) { if(clave)cache.delete(clave);else cache.clear() }
export function cargarPublico<T>(clave: string, leer: () => Promise<T>, signal?: AbortSignal): Promise<T> {
 if (signal?.aborted) return Promise.reject(new DOMException('Solicitud cancelada','AbortError'))
 let entrada = cache.get(clave)
 if (!entrada || entrada.vence <= Date.now()) {
  entrada = { promise: Promise.resolve().then(leer), vence: Infinity }
  const actual = entrada
  cache.set(clave,actual)
  actual.promise.then(() => { if(cache.get(clave)===actual) actual.vence=Date.now()+TTL },()=>{ if(cache.get(clave)===actual)cache.delete(clave) })
 }
 const promesa = entrada.promise as Promise<T>
 if (!signal) return promesa
 return new Promise<T>((resolve,reject) => {
  const abortar=()=>{signal.removeEventListener('abort',abortar);reject(new DOMException('Solicitud cancelada','AbortError'))}
  signal.addEventListener('abort',abortar,{once:true})
  promesa.then(valor=>{signal.removeEventListener('abort',abortar);if(!signal.aborted)resolve(valor)},error=>{signal.removeEventListener('abort',abortar);if(!signal.aborted)reject(error)})
 })
}
