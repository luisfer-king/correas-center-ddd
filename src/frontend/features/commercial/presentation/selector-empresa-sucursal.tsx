import { useEffect, useId, useState } from 'react';
import { empresasApi } from '../api/empresas';
import type { EmpresaCrm } from '../api/tipos-crm';

export function SelectorEmpresaSucursal({ valor, cambiar, bloqueado, soloLectura = false }: {
    valor: string; cambiar: (id: string) => void; bloqueado: boolean; soloLectura?: boolean
}) {
    const id = useId()
    const [empresas, setEmpresas] = useState<EmpresaCrm[]>([])
    const [busqueda, setBusqueda] = useState('')
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState('')
    useEffect(() => {
        const control = new AbortController()
        async function cargar() {
            const todas: EmpresaCrm[] = []
            for (let pagina = 1; pagina <= 10000; pagina++) {
                const lote = await empresasApi.listar(pagina, { signal: control.signal })
                todas.push(...lote.filter((e) => e.estado !== 'eliminado'))
                if (lote.length < 100) break
                if (pagina === 10000) throw new Error('Demasiadas empresas para cargar el selector.')
            }
            if (!control.signal.aborted) setEmpresas([...new Map(todas.map((e) => [e.id, e])).values()])
        }
        void cargar().catch(() => { if (!control.signal.aborted) setError('No se pudieron cargar las empresas. Verifica el permiso de lectura de Empresas.') })
            .finally(() => { if (!control.signal.aborted) setCargando(false) })
        return () => control.abort()
    }, [])
    const visibles = empresas.filter((e) => e.id === valor || e.nombre.toLocaleLowerCase().includes(busqueda.toLocaleLowerCase()))
    return <div className="grid gap-2 sm:col-span-2">
        <label htmlFor={id} className="text-sm font-medium">Empresa</label>
        {!soloLectura && <input aria-label="Buscar empresa" placeholder="Buscar empresa…" value={busqueda}
            disabled={bloqueado || cargando} onChange={(e) => setBusqueda(e.target.value)} className="rounded border bg-white p-2" />}
        <select id={id} required value={valor} onChange={(e) => cambiar(e.target.value)}
            disabled={bloqueado || cargando || soloLectura} className="rounded border bg-white p-2">
            <option value="">{cargando ? 'Cargando empresas…' : empresas.length ? 'Selecciona una empresa' : 'No hay empresas registradas'}</option>
            {visibles.map((e) => <option key={e.id} value={e.id} disabled={e.estado !== 'activo'}>
                {e.nombre}{e.estado !== 'activo' ? ' (inactiva)' : ''}</option>)}
        </select>
        {soloLectura && <small>La empresa de una sucursal existente no se modifica.</small>}
        {error && <p role="alert" className="text-red-700">{error}</p>}
    </div>
}
