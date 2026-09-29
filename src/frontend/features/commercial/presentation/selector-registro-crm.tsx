import { useId, useState } from 'react';
export type OpcionRegistroCrm = { id: string; etiqueta: string }
export function SelectorRegistroCrm({ etiqueta, valor, opciones, cambiar, obligatorio = false,
    bloqueado = false, cargando = false, error = '', vacio = 'No hay nadie asignado' }: {
        etiqueta: string; valor: string; opciones: readonly OpcionRegistroCrm[]; cambiar: (id: string) => void
        obligatorio?: boolean; bloqueado?: boolean; cargando?: boolean; error?: string; vacio?: string
    }) {
    const id = useId()
    const [buscar, setBuscar] = useState('')
    const visibles = opciones.filter((o) => o.id === valor || o.etiqueta.toLocaleLowerCase('es').includes(buscar.trim().toLocaleLowerCase('es')))
    const ausente = !!valor && !opciones.some((o) => o.id === valor)
    return <div className="grid gap-2">
        <label htmlFor={id} className="text-sm font-medium">{etiqueta}</label>
        <input type="search" aria-label={`Buscar ${etiqueta.toLocaleLowerCase('es')}`} placeholder="Buscar…"
            value={buscar} disabled={bloqueado || cargando || !!error} onChange={(e) => setBuscar(e.target.value)} className="rounded border bg-white p-2" />
        <select id={id} required={obligatorio} disabled={bloqueado || cargando || !!error} value={valor}
            onChange={(e) => cambiar(e.target.value)} className="rounded border bg-white p-2">
            <option value="">{cargando ? 'Cargando…' : error ? 'No se pudieron cargar los registros' : vacio}</option>
            {ausente && <option value={valor} disabled>Registro asignado no disponible</option>}
            {visibles.map((o) => <option key={o.id} value={o.id}>{o.etiqueta}</option>)}
        </select>
        {!cargando && !error && opciones.length === 0 && <small>No hay registros disponibles.</small>}
        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
    </div>
}
