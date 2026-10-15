import { useEffect, useState } from 'react'
import type { MarcaPublica } from '../../../../shared/publico/catalogo'
import type { PresentacionMarcas } from '../../../../shared/publico/cms'
import { marcasInicio } from '../../publico/api/cliente-contenido-publico'
import { MarcasPresentacion } from '../../publico/presentation/marcas-presentacion'
export function PreviewMarcas({ modo }: { modo: PresentacionMarcas }) {
 const [marcas, setMarcas] = useState<MarcaPublica[]>([]), [error, setError] = useState('')
 useEffect(() => { const c = new AbortController(); marcasInicio(c.signal).then(setMarcas).catch(e => { if (!c.signal.aborted) setError(e instanceof Error ? e.message : 'No se pudo cargar la vista previa') }); return () => c.abort() }, [])
 return <div style={{gridColumn:'1 / -1',minWidth:0}}><p>Vista previa · {modo === 'todas' ? 'Mostrar todas' : 'Carrusel'}</p>{error && <p role="status">{error}</p>}<MarcasPresentacion marcas={marcas} modo={modo} /><small>La selección cambia esta vista previa. Guarda para publicar la opción; el registro debe estar activo.</small></div>
}
