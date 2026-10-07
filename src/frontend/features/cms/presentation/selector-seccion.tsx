import { useEffect, useId, useState } from 'react'
export type OpcionSeccion = { id: string; nombre: string; slug?: string }
export function SelectorSeccion({ etiqueta, valor, cargar, cambiar, bloqueado = false }: {
  etiqueta: string; valor: string; cargar: (pagina: number, signal: AbortSignal) => Promise<{ opciones: OpcionSeccion[]; mas: boolean }>; cambiar: (id: string, opcion?: OpcionSeccion) => void; bloqueado?: boolean
}) {
  const id = useId()
  const [opciones, setOpciones] = useState<OpcionSeccion[]>([]), [buscar, setBuscar] = useState('')
  const [pagina, setPagina] = useState(1), [mas, setMas] = useState(false), [error, setError] = useState(''), [cargando, setCargando] = useState(true), [revision, setRevision] = useState(0)
  useEffect(() => {
    const abortar = new AbortController(); setCargando(true); setError('')
    void cargar(pagina, abortar.signal).then(r => { if (!abortar.signal.aborted) { setOpciones(a => pagina === 1 ? r.opciones : [...a, ...r.opciones.filter(o => !a.some(x => x.id === o.id))]); setMas(r.mas) } }).catch(e => { if (!abortar.signal.aborted) setError(e instanceof Error ? e.message : 'No se pudieron cargar las opciones') }).finally(() => { if (!abortar.signal.aborted) setCargando(false) })
    return () => abortar.abort()
  }, [cargar, pagina, revision])
  const visibles = opciones.filter(o => o.id === valor || `${o.nombre} ${o.id}`.toLocaleLowerCase('es').includes(buscar.trim().toLocaleLowerCase('es')))
  return <div><label htmlFor={`${id}-buscar`}>Buscar {etiqueta.toLocaleLowerCase('es')}<input id={`${id}-buscar`} type="search" value={buscar} disabled={bloqueado} onChange={e => setBuscar(e.target.value)} placeholder="Buscar por nombre o ID" /></label>
    <label htmlFor={id}>{etiqueta} *<select id={id} value={valor} required disabled={bloqueado || cargando} onChange={e => cambiar(e.target.value, opciones.find(o => o.id === e.target.value))}><option value="">Seleccionar…</option>{valor && !opciones.some(o => o.id === valor) && <option value={valor}>Registro #{valor}</option>}{visibles.map(o => <option key={o.id} value={o.id}>{o.nombre} · #{o.id}</option>)}</select></label>
    <small>La búsqueda filtra las opciones cargadas.</small>{cargando && <p role="status">Cargando…</p>}{error && <p role="alert">{error} <button type="button" disabled={bloqueado} onClick={() => setRevision(r => r+1)}>Reintentar</button></p>}
    {mas && <button type="button" disabled={bloqueado || cargando} onClick={() => setPagina(p => p+1)}>Cargar más</button>}
  </div>
}
