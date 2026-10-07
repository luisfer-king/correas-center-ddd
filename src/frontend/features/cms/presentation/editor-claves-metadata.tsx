import { useId, useState } from 'react'
import { agregarClaveCms } from './campos-cms'

export function EditorClavesMetadata({ titulo, claves, cambiar, ayuda, ocupado }: {
  titulo: string; claves: readonly string[]; cambiar: (claves: string[]) => void; ayuda?: string; ocupado: boolean
}) {
  const id = useId()
  const textoAyuda = ayuda?.replace('Claves separadas por comas.', 'Agrega o quita campos.')
  const [texto, setTexto] = useState('')
  const [error, setError] = useState('')
  function agregar() {
    if (ocupado) return
    try { cambiar(agregarClaveCms(claves, texto)); setTexto(''); setError('') }
    catch (e) { setError(e instanceof Error ? e.message : 'No se pudo agregar la clave') }
  }
  return <fieldset className="cms-metadata" disabled={ocupado}>
    <legend>{titulo} <span>(opcional)</span></legend>
    {textoAyuda && <p id={`${id}-ayuda`}>{textoAyuda}</p>}
    <div className="cms-metadata-add"><label className="cms-sr" htmlFor={id}>Nombre del campo</label>
      <input id={id} value={texto} placeholder="nombre_del_campo" aria-describedby={textoAyuda ? `${id}-ayuda` : undefined}
        onChange={e => { setTexto(e.target.value); setError('') }}
        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); agregar() } }} />
      <button type="button" onClick={agregar}>Agregar</button>
    </div>
    <ul className="cms-metadata-chips" aria-label="Claves agregadas">{claves.map(clave => <li key={clave}>
      <span>{clave}</span><button type="button" aria-label={`Quitar ${clave}`} onClick={() => { cambiar(claves.filter(c => c !== clave)); setError('') }}>×</button>
    </li>)}</ul>
    {!claves.length && <small>Sin campos adicionales.</small>}
    {error && <p className="cms-error" role="alert">{error}</p>}
  </fieldset>
}
