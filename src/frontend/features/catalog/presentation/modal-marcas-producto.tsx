import { useEffect, useState } from 'react'
import { solicitarApi } from '../../../shared/api/cliente-http'
import { MiniaturaImagen } from '../../../shared/imagenes/miniatura-imagen'
import { ModalPortal } from '../../iam/presentation/modal-portal'
import { asignaciones_marcaApi } from '../api/asignaciones-marca'
import { marcasApi } from '../api/marcas'
import type { AsignacionMarcaCatalogo, MarcaCatalogo } from '../api/tipos-catalogo'

async function todas<T>(listar: (pagina: number) => Promise<T[]>, signal: AbortSignal) {
    const filas: T[] = []
    for (let pagina = 1; pagina <= 10000; pagina++) {
        signal.throwIfAborted(); const lote = await listar(pagina); signal.throwIfAborted()
        filas.push(...lote); if (lote.length < 100) return filas
    }
    throw new Error('Demasiados registros para cargar las marcas.')
}
export function ModalMarcasProducto({ productoId, nombre, cerrar, guardado, puedeGestionar, permisosComprobados }: {
    productoId: string; nombre: string; cerrar: () => void; guardado: () => void; puedeGestionar: boolean; permisosComprobados: boolean
}) {
    const [marcas, setMarcas] = useState<MarcaCatalogo[]>([])
    const [asignaciones, setAsignaciones] = useState<AsignacionMarcaCatalogo[]>([])
    const [iniciales, setIniciales] = useState<Set<string>>(new Set())
    const [seleccionadas, setSeleccionadas] = useState<Set<string>>(new Set())
    const [busqueda, setBusqueda] = useState(''), [cargando, setCargando] = useState(true)
    const [ocupado, setOcupado] = useState(false), [error, setError] = useState(''), [errorCarga, setErrorCarga] = useState(false)
    useEffect(() => {
        const control = new AbortController(), signal = control.signal
        void Promise.all([
            todas(p => marcasApi.listar(p, {}, { signal }), signal),
            todas(p => asignaciones_marcaApi.listar(p, { productoId }, { signal }), signal),
        ]).then(([lista, vinculos]) => {
            if (signal.aborted) return
            const activos = new Set(vinculos.filter(v => v.estado === 'activo').map(v => v.marcaId))
            setMarcas(lista); setAsignaciones(vinculos); setIniciales(activos); setSeleccionadas(new Set(activos)); setCargando(false)
        }).catch(fallo => { if (!signal.aborted) { setError(`${fallo instanceof Error ? fallo.message : 'No se pudieron cargar las marcas.'} Para consultar las marcas se requieren catalog.marcas.read y catalog.asignaciones_marca.read.`); setErrorCarga(true); setCargando(false) } })
        return () => control.abort()
    }, [productoId])
    const visibles = marcas.filter(m => m.nombre.toLocaleLowerCase('es').includes(busqueda.toLocaleLowerCase('es')))
    function cambiar(id: string, marcar: boolean) {
        setSeleccionadas(actual => { const siguiente = new Set(actual); if (marcar) siguiente.add(id); else siguiente.delete(id); return siguiente })
    }
    async function guardar() {
        if (ocupado || cargando || errorCarga || !puedeGestionar) return
        setOcupado(true); setError('')
        try {
            await solicitarApi(`/api/portal/catalogo/productos/${encodeURIComponent(productoId)}/marcas`, {
                metodo: 'PATCH', cuerpo: {
                    asignar: [...seleccionadas].filter(id => !iniciales.has(id)), desasignar: [...iniciales].filter(id => !seleccionadas.has(id)),
                }
            })
            guardado()
        } catch (fallo) { setError(fallo instanceof Error ? fallo.message : 'No se guardaron las marcas.') }
        finally { setOcupado(false) }
    }
    return <ModalPortal titulo={`Marcas · ${nombre}`} cerrar={cerrar} bloqueado={ocupado}>
        <p>Selecciona las marcas del producto. Desmarca las que quieras retirar.</p>
        {!permisosComprobados && <p role="status" className="mt-3 rounded bg-amber-50 p-3 text-amber-900">Los permisos aún no están disponibles. Si el mensaje persiste, cierra este diálogo y pulsa Actualizar para volver a consultarlos.</p>}
        {permisosComprobados && !puedeGestionar && <p className="mt-3 rounded bg-amber-50 p-3 text-amber-900">Solo consulta. Para asignar o retirar marcas necesitas el permiso catalog.asignaciones_marca.manage.</p>}
        {cargando && <p role="status">Cargando marcas…</p>}
        {!cargando && !errorCarga && <>
            <input type="search" aria-label="Buscar marcas" placeholder="Buscar marca…" value={busqueda} onChange={e => setBusqueda(e.target.value)} className="my-3 w-full rounded border p-2" />
            <div className="mb-3 flex gap-2">
                <button type="button" disabled={ocupado || !puedeGestionar} onClick={() => setSeleccionadas(actual => new Set([...actual, ...visibles.filter(m => m.estado === 'activo').map(m => m.id)]))} className="rounded border px-2 py-1">Seleccionar visibles</button>
                <button type="button" disabled={ocupado || !puedeGestionar} onClick={() => setSeleccionadas(actual => new Set([...actual].filter(id => !visibles.some(m => m.id === id))))} className="rounded border px-2 py-1">Desmarcar visibles</button>
            </div>
            <div className="max-h-80 overflow-y-auto rounded border">
                {visibles.map(m => <div key={m.id} className="flex items-center gap-3 border-b p-2">
                    <input type="checkbox" aria-label={m.nombre} checked={seleccionadas.has(m.id)}
                        disabled={ocupado || !puedeGestionar || (m.estado !== 'activo' && !iniciales.has(m.id))} onChange={e => cambiar(m.id, e.target.checked)} />
                    <MiniaturaImagen url={m.logo} nombre={m.nombre} /><span>{m.nombre} {m.estado !== 'activo' && `(${m.estado})`}</span>
                </div>)}
                {!visibles.length && <p className="p-3">No hay marcas para mostrar.</p>}
            </div>
            {asignaciones.filter(a => a.estado === 'activo' && !marcas.some(m => m.id === a.marcaId)).map(a =>
                <label key={a.id} className="mt-2 block"><input type="checkbox" disabled={ocupado || !puedeGestionar} checked={seleccionadas.has(a.marcaId)}
                    onChange={e => cambiar(a.marcaId, e.target.checked)} /> Marca asignada no disponible (#{a.marcaId})</label>)}
            <p className="mt-2 text-sm">{seleccionadas.size} marcas seleccionadas.</p>
        </>}
        {error && <p role="alert" className="mt-3 text-red-700">{error}</p>}
        <div className="mt-5 flex justify-end gap-3">
            <button type="button" disabled={ocupado} onClick={cerrar} className="rounded border px-3 py-2">Cancelar</button>
            <button type="button" disabled={ocupado || cargando || errorCarga || !puedeGestionar} onClick={() => void guardar()} className="rounded bg-red-700 px-3 py-2 text-white">{ocupado ? 'Guardando…' : 'Guardar marcas'}</button>
        </div>
    </ModalPortal>
}
