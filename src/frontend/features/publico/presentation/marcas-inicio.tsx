import { useEffect, useState } from 'react'
import type { MarcaPublica } from '../../../../shared/publico/catalogo'
import type { PresentacionMarcas } from '../../../../shared/publico/cms'
import { consultarConfiguracionPublico } from '../../cms/api/publico/cliente-configuracion'
import { cargarPublico, invalidarCachePublica } from '../api/cache-publica'
import { marcasInicio } from '../api/cliente-contenido-publico'
import { revisionPublicaClave } from '../api/actualizacion-publica'
import { useRecursoPublico } from './use-recurso-publico'
import { MarcasPresentacion } from './marcas-presentacion'

export function MarcasInicio({ modoInicial }: { modoInicial: PresentacionMarcas }) {
 const [modo, setModo] = useState(modoInicial)
 const { datos, error, cargando, elemento, reintentar } = useRecursoPublico(marcasInicio, [] as MarcaPublica[])
 useEffect(() => setModo(modoInicial), [modoInicial])
 useEffect(() => {
  let c: AbortController | undefined
  async function actualizar() {
   if (document.visibilityState === 'hidden') return
   c?.abort(); c = new AbortController(); const actual = c
   try { invalidarCachePublica('configuracion'); const config = await cargarPublico('configuracion',()=>consultarConfiguracionPublico(),actual.signal); if (!actual.signal.aborted) setModo(config.marcas?.presentacion ?? 'carrusel') } catch { /* Mantener el modo publicado durante un fallo temporal. */ }
  }
  const storage = (e: StorageEvent) => { if (e.key === revisionPublicaClave) void actualizar() }
  const foco = () => void actualizar()
  window.addEventListener('storage', storage); window.addEventListener('focus', foco); window.addEventListener('publico:actualizado', foco)
  document.addEventListener('visibilitychange', foco)
  return () => { c?.abort(); window.removeEventListener('storage', storage); window.removeEventListener('focus', foco); window.removeEventListener('publico:actualizado', foco); document.removeEventListener('visibilitychange', foco) }
 }, [])
 return <section className="publico-bloque-inicio publico-bloque-marcas" ref={elemento}><div className="publico-inicio-contenedor"><div className="publico-titulo-inicio"><span>Calidad y confianza</span><h2>Marcas que nos respaldan</h2></div>
  {cargando && !datos.length && <p role="status">Cargando marcas…</p>}{error && <div role="alert"><p>No se pudieron cargar las marcas.</p><button onClick={reintentar}>Reintentar</button></div>}
  {!cargando && !error && !datos.length && <p>No hay marcas publicadas.</p>}<MarcasPresentacion marcas={datos} modo={modo} /><div className="publico-marcas-autorizacion"><span>FABRICANTE AUTORIZADO</span><h3>Licencia Exclusiva SKF para Bolivia</h3><p>Únicos autorizados para fabricar sellos y retenes SKF en el país</p></div>
 </div></section>
}
