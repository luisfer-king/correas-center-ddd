import { useEffect, useState, type FormEvent } from 'react'
import { metadataSeccionApi, type MetadataSeccionDto } from '../api/cliente-metadata-seccion'
import { tipos_seccionApi } from '../api/cliente-tipos-seccion'
import type { TipoSeccionDto } from '../api/tipos-tipos-seccion'
import { ModalPortal } from '../../iam/presentation/modal-portal'
import { CamposMetadataSeccion } from './campos-metadata-seccion'
import { metadataFormularioSeccion } from './datos-formulario-seccion'
export function MetadataSeccion({ id, gestionar, cerrar, actualizado }: { id: string; gestionar: boolean; cerrar: () => void; actualizado: () => void }) {
  const [datos,setDatos] = useState<MetadataSeccionDto>(), [tipo,setTipo] = useState<TipoSeccionDto>(), [valores,setValores] = useState<Record<string,unknown>>({}), [error,setError] = useState(''), [ocupado,setOcupado] = useState(false)
  useEffect(() => { const c = new AbortController(); setDatos(undefined); setTipo(undefined); setError('')
    void metadataSeccionApi.obtener(id,c.signal).then(async d => { const t = await tipos_seccionApi.obtener(d.tipoSeccionId,c.signal); if (!c.signal.aborted) { setDatos(d); setTipo(t); setValores(d.metadata) } }).catch(e => { if (!c.signal.aborted) setError(e instanceof Error ? e.message : 'No se pudo consultar la metadata') }); return () => c.abort()
  },[id])
  async function guardar(e: FormEvent) {
    e.preventDefault(); if (!datos || !tipo || ocupado || !gestionar) return; setOcupado(true); setError('')
    try { await metadataSeccionApi.reemplazar(id,datos.actualizadoEn,metadataFormularioSeccion(tipo.camposMetadata,valores)); actualizado(); cerrar() }
    catch(e) { setError(e instanceof Error ? e.message : 'No se pudo guardar') } finally { setOcupado(false) }
  }
  return <ModalPortal titulo={`Metadata de sección #${id}`} cerrar={cerrar} bloqueado={ocupado}><div className="cms-dialog">
    {error && <p role="alert" className="cms-error">{error}</p>}{!datos && !error && <p role="status">Cargando…</p>}
    {datos && tipo && (gestionar ? <form className="cms-form" onSubmit={e => void guardar(e)}><fieldset disabled={ocupado}><CamposMetadataSeccion nombre={tipo.nombre} claves={tipo.camposMetadata} valores={valores} cambiar={setValores} /></fieldset><div className="cms-actions"><button type="button" disabled={ocupado} onClick={cerrar}>Cancelar</button><button type="submit" className="cms-primary" disabled={ocupado}>Guardar</button></div></form> : <pre>{JSON.stringify(datos.metadata,null,2)}</pre>)}
  </div></ModalPortal>
}
