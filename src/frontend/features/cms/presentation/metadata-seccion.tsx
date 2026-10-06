import { useEffect, useState } from 'react'
import { metadataSeccionApi } from '../api/cliente-metadata-seccion'
import type { MetadataSeccionDto } from '../api/cliente-metadata-seccion'
import { ModalPortal } from '../../iam/presentation/modal-portal'
import { FormularioCms } from './formulario-cms'
export function MetadataSeccion({ id, gestionar, cerrar, actualizado }: { id: string; gestionar: boolean; cerrar: () => void; actualizado: () => void }) {
 const [datos,setDatos] = useState<MetadataSeccionDto>(); const [error,setError] = useState(''); const [ocupado,setOcupado] = useState(false)
 useEffect(() => { const c = new AbortController(); void metadataSeccionApi.obtener(id,c.signal).then(d => { if (!c.signal.aborted) setDatos(d) }).catch(e => { if (!c.signal.aborted) setError(e instanceof Error ? e.message : 'No se pudo consultar la metadata') }); return () => c.abort() },[id])
 return <ModalPortal titulo={`Metadata de sección #${id}`} cerrar={cerrar} bloqueado={ocupado}><div className="cms-dialog">
 {error && <p role="alert" className="cms-error">{error}</p>}{!datos && !error && <p role="status">Cargando…</p>}
 {datos && (gestionar ? <FormularioCms campos={[{clave:'metadata',etiqueta:'Metadata',tipo:'json',ayuda:'Solo se aceptan las claves definidas por el tipo de sección.'}]} datos={{metadata:datos.metadata}} ocupado={ocupado} cancelar={cerrar} guardar={async d => { setOcupado(true); try { await metadataSeccionApi.reemplazar(id,datos.actualizadoEn,d.metadata as Record<string,unknown>); actualizado(); cerrar() } finally { setOcupado(false) } }} /> : <pre>{JSON.stringify(datos.metadata,null,2)}</pre>)}
 </div></ModalPortal>
}
