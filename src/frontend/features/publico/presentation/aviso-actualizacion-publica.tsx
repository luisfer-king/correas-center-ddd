import { useEffect, useState } from 'react'
import { revisionPublicaClave } from '../api/actualizacion-publica'
/** No recargar automáticamente: el visitante podría estar completando Contacto. */
export function AvisoActualizacionPublica({ actualizar }: { actualizar: () => void }) {
 const [pendiente, setPendiente] = useState(false)
 useEffect(() => {
  const cambio = () => setPendiente(true)
  const storage = (event: StorageEvent) => { if (event.key === revisionPublicaClave && event.newValue) cambio() }
  window.addEventListener('publico:actualizado', cambio)
  window.addEventListener('storage', storage)
  return () => { window.removeEventListener('publico:actualizado', cambio); window.removeEventListener('storage', storage) }
 }, [])
 if (!pendiente) return null
 return <aside className="publico-aviso-actualizacion" role="status"><span>Hay contenido actualizado disponible. Si estás completando una consulta, envíala antes de actualizar.</span><button type="button" onClick={() => {setPendiente(false); actualizar()}}>Actualizar contenido</button><button type="button" onClick={() => setPendiente(false)}>Más tarde</button></aside>
}
