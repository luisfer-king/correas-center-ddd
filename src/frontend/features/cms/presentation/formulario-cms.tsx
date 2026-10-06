import { useId, useState, type FormEvent } from 'react'
import { construirDatosCms, valoresInicialesCms } from './campos-cms'
import type { CampoCms, DatosFormularioCms } from './campos-cms'
export function FormularioCms({ campos, datos = {}, guardar, ocupado, cancelar }: { campos: readonly CampoCms[]; datos?: DatosFormularioCms; guardar: (datos: DatosFormularioCms) => Promise<void>; ocupado: boolean; cancelar: () => void }) {
 const prefijo = useId(); const [valores,setValores] = useState(() => valoresInicialesCms(campos,datos)); const [error,setError] = useState('')
 async function enviar(e: FormEvent) { e.preventDefault(); if (ocupado) return; setError(''); try { await guardar(construirDatosCms(campos,valores)) } catch (e) { setError(e instanceof Error ? e.message : 'No se pudo guardar') } }
 return <form className="cms-form" onSubmit={e => void enviar(e)}><fieldset disabled={ocupado}>
 {campos.map(c => <label key={c.clave} htmlFor={`${prefijo}-${c.clave}`}><span>{c.etiqueta}{!c.nullable && c.tipo !== 'booleano' && c.tipo !== 'claves' ? ' *' : ''}</span>
 {c.tipo === 'area' || c.tipo === 'json' || c.tipo === 'claves' ? <textarea id={`${prefijo}-${c.clave}`} rows={c.tipo === 'json' ? 6 : 3} value={valores[c.clave]} onChange={e => setValores(v => ({...v,[c.clave]:e.target.value}))} spellCheck={c.tipo !== 'json'} /> : c.tipo === 'select' || c.tipo === 'booleano' || c.tipo === 'triestado' ? <select id={`${prefijo}-${c.clave}`} value={valores[c.clave]} onChange={e => setValores(v => ({...v,[c.clave]:e.target.value}))}>
 {(c.nullable || c.tipo === 'triestado') && <option value="">Sin definir</option>}{(c.tipo === 'booleano' || c.tipo === 'triestado' ? ['true','false'] : c.opciones ?? []).map(o => <option key={o} value={o}>{o === 'true' ? 'Sí' : o === 'false' ? 'No' : o}</option>)}</select> : <input id={`${prefijo}-${c.clave}`} type={c.tipo === 'numero' ? 'number' : 'text'} min={c.tipo === 'numero' ? 0 : undefined} max={c.tipo === 'numero' ? 2147483647 : undefined} step={c.tipo === 'numero' ? 1 : undefined} inputMode={c.tipo === 'id' ? 'numeric' : undefined} value={valores[c.clave]} onChange={e => setValores(v => ({...v,[c.clave]:e.target.value}))} />}
 {c.ayuda && <small>{c.ayuda}</small>}</label>)}
 </fieldset>{error && <p role="alert" className="cms-error">{error}</p>}<div className="cms-actions"><button type="button" disabled={ocupado} onClick={cancelar}>Cancelar</button><button className="cms-primary" disabled={ocupado} type="submit">{ocupado ? 'Guardando…' : 'Guardar'}</button></div></form>
}
