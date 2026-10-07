import { CamposMetadataSeccion } from './campos-metadata-seccion'
import { useEffect, useId, useState, type FormEvent } from 'react'
import { empresasApi } from '../../commercial/api/empresas'
import { tipos_seccionApi } from '../api/cliente-tipos-seccion'
import type { TipoSeccionDto } from '../api/tipos-tipos-seccion'
import { CampoImagen } from '../../../shared/imagenes/campo-imagen'
import { SelectorSeccion } from './selector-seccion'
import { camposFormularioSeccion, metadataFormularioSeccion } from './datos-formulario-seccion'
import type { DatosFormularioCms } from './campos-cms'
async function cargarEmpresas(pagina: number, signal: AbortSignal) {
  const lote = await empresasApi.listar(pagina, { signal })
  return { opciones: lote.filter(e => e.estado === 'activo').map(e => ({ id: e.id, nombre: e.nombre })), mas: lote.length === 100 }
}
async function cargarTipos(pagina: number, signal: AbortSignal) {
  const lote = await tipos_seccionApi.listar({ estado: 'activo', limite: 200, desplazamiento: (pagina-1)*200 }, signal)
  return { opciones: lote.map(e => ({ id: e.id, nombre: e.nombre })), mas: lote.length === 200 }
}
export function FormularioContenidoSeccion({ datos = {}, editar = false, guardar, ocupado, cancelar }: {
  datos?: DatosFormularioCms; editar?: boolean; guardar: (datos: DatosFormularioCms) => Promise<void>; ocupado: boolean; cancelar: () => void
}) {
  const id = useId()
  const [empresa, setEmpresa] = useState(String(datos.empresaId ?? '')), [tipoId, setTipoId] = useState(String(datos.tipoSeccionId ?? ''))
  const [campos, setCampos] = useState<Record<string,string>>(() => Object.fromEntries(['titulo','subtitulo','descripcion','icono','imagen'].map(k => [k, String((datos.campos as Record<string,unknown> | undefined)?.[k] ?? '')])))
  const [metadata, setMetadata] = useState<Record<string,unknown>>(() => ({ ...(datos.metadata as Record<string,unknown> | undefined ?? {}) }))
  const [tipo, setTipo] = useState<TipoSeccionDto>(), [cargando, setCargando] = useState(false), [errorTipo, setErrorTipo] = useState(''), [error, setError] = useState(''), [revision, setRevision] = useState(0)
  const [imagenPendiente, setImagenPendiente] = useState(false), [mostrar, setMostrar] = useState(datos.mostrar !== false)
  useEffect(() => {
    const abortar = new AbortController(); setTipo(undefined); setErrorTipo('')
    if (!tipoId) { setCargando(false); return () => abortar.abort() }
    setCargando(true)
    void tipos_seccionApi.obtener(tipoId, abortar.signal).then(t => { if (!abortar.signal.aborted) setTipo(t) }).catch(e => { if (!abortar.signal.aborted) setErrorTipo(e instanceof Error ? e.message : 'No se pudo cargar el tipo') }).finally(() => { if (!abortar.signal.aborted) setCargando(false) })
    return () => abortar.abort()
  }, [tipoId, revision])
  const bloqueado = ocupado || imagenPendiente || cargando || !tipo || !!errorTipo
  async function enviar(e: FormEvent) {
    e.preventDefault(); if (bloqueado) return; setError('')
    try {
      if (!empresa || !tipoId) throw new Error('Selecciona la empresa y el tipo de sección')
      const cuerpo = { campos: camposFormularioSeccion(campos), metadata: metadataFormularioSeccion(tipo!.camposMetadata, metadata) }
      await guardar(editar ? cuerpo : { ...cuerpo, empresaId: empresa, tipoSeccionId: tipoId, mostrar })
    } catch (e) { setError(e instanceof Error ? e.message : 'No se pudo guardar') }
  }
  return <form className="cms-form cms-section-form" onSubmit={e => void enviar(e)}><fieldset disabled={ocupado}>
    <SelectorSeccion etiqueta="Empresa" valor={empresa} cargar={cargarEmpresas} cambiar={setEmpresa} bloqueado={editar || ocupado} />
    <SelectorSeccion etiqueta="Tipo de sección" valor={tipoId} cargar={cargarTipos} cambiar={v => { setTipoId(v); setTipo(undefined); setCargando(!!v); setMetadata({}) }} bloqueado={editar || ocupado} />
    {editar && <small>La empresa y el tipo se conservan al editar esta sección.</small>}
    {(['titulo','subtitulo','descripcion','icono'] as const).map(k => <label key={k} htmlFor={`${id}-${k}`}>{{ titulo: 'Título', subtitulo: 'Subtítulo (opcional)', descripcion: 'Descripción (opcional)', icono: 'Icono de Lucide (opcional)' }[k]}
      {k === 'descripcion' ? <textarea id={`${id}-${k}`} rows={3} value={campos[k]} onChange={e => setCampos(c => ({ ...c, [k]: e.target.value }))} /> : <input id={`${id}-${k}`} value={campos[k]} onChange={e => setCampos(c => ({ ...c, [k]: e.target.value }))} />}</label>)}
    <CampoImagen etiqueta="Imagen (opcional)" valor={campos.imagen} endpoint="/api/portal/cms/imagenes/contenidos-seccion" actualizar={v => setCampos(c => ({ ...c, imagen: v }))} actividad={setImagenPendiente} bloqueado={ocupado} />
    {campos.imagen && <button type="button" disabled={ocupado || imagenPendiente} onClick={() => setCampos(c => ({ ...c, imagen: '' }))}>Quitar imagen</button>}
    {cargando && <p role="status">Cargando campos del tipo de sección…</p>}
    {errorTipo && <p role="alert">{errorTipo} <button type="button" onClick={() => setRevision(r => r+1)}>Reintentar</button></p>}
    {tipo && <CamposMetadataSeccion nombre={tipo.nombre} claves={tipo.camposMetadata} valores={metadata} cambiar={setMetadata} />}
    {!editar && <><label className="cms-check"><input type="checkbox" checked={mostrar} onChange={e => setMostrar(e.target.checked)} />Visible</label><small>El orden se asignará al guardar, desde 1 y después del mayor orden de este tipo de sección.</small></>}
  </fieldset>{error && <p role="alert" className="cms-error">{error}</p>}<div className="cms-actions"><button type="button" disabled={ocupado} onClick={cancelar}>Cancelar</button><button type="submit" className="cms-primary" disabled={bloqueado}>{ocupado ? 'Guardando…' : 'Guardar'}</button></div></form>
}
