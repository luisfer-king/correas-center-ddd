import { useEffect, useState } from 'react'
import { cargarReferencias, type OpcionReferencia } from './referencias-catalogo'
import type { Referencia } from './configuracion-catalogo'
export function SelectorCatalogo({ referencia, valor, actualizar, obligatorio, bloqueado }: {
  referencia: Referencia; valor: string; actualizar: (id: string) => void; obligatorio?: boolean; bloqueado?: boolean
}) {
  const [opciones, setOpciones] = useState<OpcionReferencia[]>([])
  const [filtro, setFiltro] = useState('')
  const [error, setError] = useState(false)
  const [pagina, setPagina] = useState(1)
  const [mas, setMas] = useState(false)
  useEffect(() => {
    const controlador = new AbortController()
    setError(false)
    void cargarReferencias(referencia, pagina, controlador.signal).then(({ opciones: lista, mas: hayMas }) => {
      if (!controlador.signal.aborted) { setOpciones(actual => pagina === 1 ? lista : [...actual, ...lista.filter(o => !actual.some(a => a.id === o.id))]); setMas(hayMas) }
    }).catch(() => { if (!controlador.signal.aborted) setError(true) })
    return () => controlador.abort()
  }, [referencia, pagina])
  useEffect(() => { setPagina(1); setOpciones([]); setMas(false); setFiltro('') }, [referencia])
  const visibles = opciones.filter(o => o.nombre.toLocaleLowerCase('es').includes(filtro.toLocaleLowerCase('es')) || o.id === valor)
  return <div className="space-y-1">
    <input type="search" value={filtro} onChange={e => setFiltro(e.target.value)} disabled={bloqueado}
      placeholder="Buscar entre los registros cargados" aria-label={`Buscar ${referencia}`}
      className="w-full rounded border border-neutral-300 bg-white p-2" />
    <select value={valor} required={obligatorio} onChange={e => actualizar(e.target.value)} disabled={bloqueado}
      className="w-full rounded border border-neutral-300 bg-white p-2">
      <option value="">Seleccionar…</option>
      {valor && !opciones.some(o => o.id === valor) && <option value={valor}>Registro #{valor}</option>}
      {visibles.map(o => <option key={o.id} value={o.id}>{o.nombre} · #{o.id}</option>)}
    </select>
    {error && <small className="text-red-700">No se pudieron cargar los registros relacionados.</small>}
    {!error && opciones.length === 0 && <small className="text-neutral-500">No hay registros activos para seleccionar.</small>}
    {mas && <button type="button" onClick={() => setPagina(p => p + 1)} className="text-sm text-red-700 underline">Cargar más registros</button>}
  </div>
}
