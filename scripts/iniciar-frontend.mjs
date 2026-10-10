import { pathToFileURL } from 'node:url'
import { setTimeout as pausar } from 'node:timers/promises'

/** Solo consulta salud; nunca repite una escritura de la aplicación. */
export async function esperarApi(url, { timeoutMs = 45000, intervaloMs = 500, intentoMs = 2000 } = {}) {
  const limite = Date.now() + timeoutMs
  while (Date.now() < limite) {
    try {
      const respuesta = await fetch(url, { signal: AbortSignal.timeout(Math.min(intentoMs, Math.max(1, limite - Date.now()))) })
      const salud = respuesta.ok ? await respuesta.json() : null
      if (salud?.status === 'ok') return
    } catch { /* La API todavía puede estar compilando o arrancando. */ }
    const restante = limite - Date.now()
    if (restante > 0) await pausar(Math.min(intervaloMs, restante))
  }
  throw new Error(`La API no respondió en ${timeoutMs / 1000}s: ${url}. Inicia el backend y revisa su consola y el destino del proxy.`)
}

export async function iniciarFrontend() {
  const { createServer } = await import('vite')
  // Carga tu vite.config y conserva plugins, host, puerto y resto de opciones.
  const servidor = await createServer()
  try {
    const proxy = servidor.config.server.proxy?.['/api']
    const destino = typeof proxy === 'string' ? proxy : proxy?.target
    if (!destino || typeof destino !== 'string') throw new Error('Configura server.proxy["/api"].target en vite.config.ts para apuntar a tu API')
    const salud = new URL('/api/health', destino)
    console.log(`Esperando a la API en ${salud.href}… Inicia el backend en otra terminal.`)
    await esperarApi(salud.href)
    await servidor.listen()
    servidor.printUrls()
  } catch (error) {
    await servidor.close()
    throw error
  }
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  iniciarFrontend().catch(error => { console.error(error.message); process.exitCode = 1 })
}
