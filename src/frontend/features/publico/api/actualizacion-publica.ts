import { invalidarCachePublica } from './cache-publica'
// Solo una señal de revisión; jamás se almacena contenido ni credenciales.
export const revisionPublicaClave = 'correas:revision-publica'
export function notificarCambioPublico() {
 invalidarCachePublica()
 if (typeof window === 'undefined') return
 window.dispatchEvent(new Event('publico:actualizado'))
 try { window.localStorage.setItem(revisionPublicaClave, Date.now()+':'+Math.random()) } catch { /* Almacenamiento deshabilitado: el foco vuelve a consultar. */ }
}
