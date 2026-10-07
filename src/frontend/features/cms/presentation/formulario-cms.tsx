import { useId, useState, type FormEvent } from 'react'
import { construirDatosCms, parsearClavesCms, valoresInicialesCms } from './campos-cms'
import type { CampoCms, DatosFormularioCms } from './campos-cms'
import { slugNombre } from '../../../../shared/slug-nombre'
import { EditorClavesMetadata } from './editor-claves-metadata'

export function FormularioCms({ campos, datos = {}, guardar, ocupado, cancelar }: {
  campos: readonly CampoCms[]; datos?: DatosFormularioCms; guardar: (datos: DatosFormularioCms) => Promise<void>; ocupado: boolean; cancelar: () => void
}) {
  const prefijo = useId()
  const [valores, setValores] = useState(() => valoresInicialesCms(campos, datos))
  const [manual, setManual] = useState<Record<string, boolean>>(() => Object.fromEntries(campos.filter(c => c.tipo === 'orden-auto').map(c => [c.clave, datos[c.clave] != null])))
  const [error, setError] = useState('')
  const cambiar = (clave: string, valor: string) => setValores(v => ({ ...v, [clave]: valor }))
  async function enviar(e: FormEvent) {
    e.preventDefault()
    if (ocupado) return
    setError('')
    try {
      for (const c of campos) if (c.tipo === 'orden-auto' && manual[c.clave] && !valores[c.clave]?.trim()) throw new Error('Escribe el orden manual')
      await guardar(construirDatosCms(campos, valores))
    } catch (e) { setError(e instanceof Error ? e.message : 'No se pudo guardar') }
  }
  return <form className="cms-form" onSubmit={e => void enviar(e)}><fieldset disabled={ocupado}>
    {campos.map(c => {
      const id = `${prefijo}-${c.clave}`
      if (c.tipo === 'claves') return <EditorClavesMetadata key={c.clave} titulo={c.etiqueta} claves={parsearClavesCms(valores[c.clave] ?? '')} ayuda={c.ayuda} ocupado={ocupado} cambiar={claves => cambiar(c.clave, JSON.stringify(claves))} />
      if (c.tipo === 'orden-auto') return <div key={c.clave} className="cms-order-choice">
        <label className="cms-check" htmlFor={`${id}-manual`}><input id={`${id}-manual`} type="checkbox" checked={!!manual[c.clave]} onChange={e => { setManual(m => ({ ...m, [c.clave]: e.target.checked })); cambiar(c.clave, e.target.checked ? '0' : '') }} />Asignar orden manualmente</label>
        {manual[c.clave] ? <label htmlFor={id}>{c.etiqueta}<input id={id} type="number" min={0} max={2147483647} step={1} value={valores[c.clave]} onChange={e => cambiar(c.clave, e.target.value)} /></label> : <small>Se ubicará después del mayor orden existente al guardar.</small>}
      </div>
      return <label key={c.clave} htmlFor={id}><span>{c.etiqueta}{!c.nullable && c.tipo !== 'booleano' ? ' *' : ''}</span>
        {c.tipo === 'slug' ? <><input id={id} readOnly value={slugNombre(valores.nombre ?? '')} placeholder="Se genera desde el nombre" /><small>Se genera automáticamente al crear el tipo.</small></> :
          c.tipo === 'area' || c.tipo === 'json' ? <textarea id={id} rows={c.tipo === 'json' ? 6 : 3} value={valores[c.clave]} onChange={e => cambiar(c.clave, e.target.value)} spellCheck={c.tipo !== 'json'} /> :
          c.tipo === 'select' || c.tipo === 'booleano' || c.tipo === 'triestado' ? <select id={id} value={valores[c.clave]} onChange={e => cambiar(c.clave, e.target.value)}>
            {(c.nullable || c.tipo === 'triestado') && <option value="">Sin definir</option>}
            {(c.tipo === 'booleano' || c.tipo === 'triestado' ? ['true', 'false'] : c.opciones ?? []).map(o => <option key={o} value={o}>{o === 'true' ? 'Sí' : o === 'false' ? 'No' : o}</option>)}
          </select> : <input id={id} type={c.tipo === 'numero' ? 'number' : 'text'} min={c.tipo === 'numero' ? 0 : undefined} max={c.tipo === 'numero' ? 2147483647 : undefined} step={c.tipo === 'numero' ? 1 : undefined} inputMode={c.tipo === 'id' ? 'numeric' : undefined} value={valores[c.clave]} placeholder={c.tipo === 'icono-lucide' ? 'Ej.: LayoutDashboard o layout-dashboard' : undefined} onChange={e => cambiar(c.clave, e.target.value)} />}
        {c.tipo === 'icono-lucide' && <small>Nombre del icono de Lucide. <a href="https://lucide.dev/icons/" target="_blank" rel="noreferrer">Consultar iconos</a></small>}
        {c.ayuda && <small>{c.ayuda}</small>}
      </label>
    })}
  </fieldset>{error && <p role="alert" className="cms-error">{error}</p>}<div className="cms-actions">
    <button type="button" disabled={ocupado} onClick={cancelar}>Cancelar</button>
    <button className="cms-primary" disabled={ocupado} type="submit">{ocupado ? 'Guardando…' : 'Guardar'}</button>
  </div></form>
}
