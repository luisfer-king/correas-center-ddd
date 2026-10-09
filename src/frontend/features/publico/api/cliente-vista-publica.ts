import type { VistaPublica } from '../../../../shared/vista-publica'
export async function obtenerVistaPublica(signal?: AbortSignal): Promise<VistaPublica> {
 const respuesta = await fetch('/api/publico/vista', { signal, credentials: 'omit', cache: 'no-store' })
 if (!respuesta.ok) throw new Error(respuesta.status === 404 ? 'La empresa pública no está disponible.' : 'No se pudo cargar la vista pública.')
 return respuesta.json() as Promise<VistaPublica>
}
