import { useEffect, useState, type FormEvent } from 'react'
import { interpretarMapaSucursal } from '../../../../shared/mapa-sucursal'
import { solicitarApi } from '../../../shared/api/cliente-http'
import { ModalPortal } from '../../iam/presentation/modal-portal'
import { sucursalesApi } from '../api/sucursales'
import type { EntradaSucursal, SucursalCrm } from '../api/tipos-crm'
import { SelectorEmpresaSucursal } from './selector-empresa-sucursal'

export function FormularioSucursal({ registro, cerrar, guardado }: {
    registro: SucursalCrm | null; cerrar: () => void; guardado: () => void
}) {
    const [empresaId, setEmpresaId] = useState(registro?.empresaId ?? '')
    const [datos, setDatos] = useState<EntradaSucursal>({
        nombre: registro?.nombre ?? '', direccion: registro?.direccion ?? '', telefono: registro?.telefono ?? '',
        email: registro?.email ?? '', horarios: registro?.horarios ?? '', mapaIncrustado: registro?.mapaIncrustado ?? '',
        latitud: registro?.latitud ?? null, longitud: registro?.longitud ?? null,
        orden: Math.max(1, registro?.orden ?? 1), esPrincipal: registro?.esPrincipal ?? false,
    })
    const [manual, setManual] = useState(false)
    const [cargandoOrden, setCargandoOrden] = useState(false)
    const [errorOrden, setErrorOrden] = useState('')
    const [ocupado, setOcupado] = useState(false)
    const [error, setError] = useState('')
    let mapa: ReturnType<typeof interpretarMapaSucursal> = { url: null, latitud: null, longitud: null }
    let errorMapa = ''
    try { mapa = interpretarMapaSucursal(datos.mapaIncrustado) } catch (e) { errorMapa = (e as Error).message }
    useEffect(() => {
        if (registro || manual || !empresaId) return
        const control = new AbortController()
        setCargandoOrden(true); setErrorOrden('')
        async function sugerir() {
            let maximo = 0
            for (let pagina = 1; pagina <= 10000; pagina++) {
                const lote = await sucursalesApi.listar(pagina, { signal: control.signal })
                for (const fila of lote) if (fila.empresaId === empresaId && fila.estado !== 'eliminado') maximo = Math.max(maximo, fila.orden)
                if (lote.length < 100) break
                if (pagina === 10000) throw new Error('No fue posible calcular el orden.')
            }
            if (!control.signal.aborted) setDatos((d) => ({ ...d, orden: maximo + 1 }))
        }
        void sugerir().catch(() => { if (!control.signal.aborted) setErrorOrden('No se pudo obtener el orden sugerido. Se calculará al guardar, o puedes indicar uno manualmente.') })
            .finally(() => { if (!control.signal.aborted) setCargandoOrden(false) })
        return () => control.abort()
    }, [empresaId, manual, registro])
    function actualizar<K extends keyof EntradaSucursal>(clave: K, valor: EntradaSucursal[K]) {
        setDatos((actual) => ({ ...actual, [clave]: valor }))
    }
    async function enviar(evento: FormEvent) {
        evento.preventDefault()
        if (ocupado || errorMapa || !empresaId) return
        setOcupado(true); setError('')
        const cuerpo = {
            ...datos, nombre: datos.nombre.trim(), direccion: datos.direccion.trim(), telefono: datos.telefono.trim(),
            email: datos.email?.trim() || null, horarios: datos.horarios?.trim() || null,
            mapaIncrustado: mapa.url, latitud: mapa.latitud, longitud: mapa.longitud
        }
        try {
            if (registro) await sucursalesApi.editar(registro.id, cuerpo)
            else await solicitarApi('/api/portal/crm/sucursales', {
                metodo: 'POST', cuerpo: {
                    ...cuerpo, empresaId, ordenAutomatico: !manual,
                }
            })
            guardado()
        } catch (fallo) { setError(fallo instanceof Error ? fallo.message : 'No se pudo guardar la sucursal.') }
        finally { setOcupado(false) }
    }
    return <ModalPortal titulo={`${registro ? 'Editar' : 'Crear'} · Sucursal`} cerrar={cerrar} bloqueado={ocupado}>
        <form onSubmit={(e) => void enviar(e)} className="grid gap-4 sm:grid-cols-2">
            <SelectorEmpresaSucursal valor={empresaId} cambiar={(id) => { setEmpresaId(id); setManual(false); actualizar('orden', 1) }}
                bloqueado={ocupado} soloLectura={!!registro} />
            {(['nombre', 'direccion', 'telefono', 'email', 'horarios'] as const).map((clave) => <label key={clave}>
                <span className="mb-1 block text-sm font-medium">{{ nombre: 'Nombre', direccion: 'Dirección', telefono: 'Teléfono', email: 'Correo', horarios: 'Horarios' }[clave]}</span>
                <input value={datos[clave] ?? ''} type={clave === 'email' ? 'email' : 'text'} required={['nombre', 'direccion', 'telefono'].includes(clave)}
                    disabled={ocupado} onChange={(e) => actualizar(clave, e.target.value)} className="w-full rounded border bg-white p-2" />
            </label>)}
            <label className="sm:col-span-2"><span className="mb-1 block text-sm font-medium">Mapa de Google Maps</span>
                <textarea rows={3} value={datos.mapaIncrustado ?? ''} disabled={ocupado}
                    placeholder="Pega el enlace src o el iframe de Compartir → Insertar un mapa"
                    onChange={(e) => actualizar('mapaIncrustado', e.target.value)} className="w-full rounded border bg-white p-2" />
            </label>
            {errorMapa && <p role="alert" className="sm:col-span-2 text-red-700">{errorMapa}</p>}
            {mapa.url && <iframe title="Vista previa de la ubicación de la sucursal" src={mapa.url} loading="lazy"
                referrerPolicy="no-referrer-when-downgrade" className="h-64 w-full rounded border sm:col-span-2" />}
            <label>Latitud<input readOnly value={mapa.latitud ?? ''} className="block w-full rounded border bg-neutral-100 p-2" /></label>
            <label>Longitud<input readOnly value={mapa.longitud ?? ''} className="block w-full rounded border bg-neutral-100 p-2" /></label>
            <label>Orden<input type="number" min={1} max={2147483647} step={1} required value={Number.isNaN(datos.orden) ? '' : datos.orden}
                disabled={ocupado || (cargandoOrden && !manual)} onChange={(e) => { setManual(true); actualizar('orden', e.target.valueAsNumber) }}
                className="block w-full rounded border bg-white p-2" />
                {!registro && <small>{cargandoOrden && !manual ? 'Calculando orden…' : manual ? 'Orden manual.' : 'Orden automático: máximo + 1 de esta empresa.'}</small>}
            </label>
            {!registro && manual && <button type="button" disabled={ocupado} onClick={() => setManual(false)}>Usar orden automático</button>}
            {errorOrden && <p role="status" className="sm:col-span-2">{errorOrden}</p>}
            <label><input type="checkbox" checked={datos.esPrincipal} disabled={ocupado}
                onChange={(e) => actualizar('esPrincipal', e.target.checked)} /> Sucursal principal</label>
            {error && <p role="alert" className="sm:col-span-2 text-red-700">{error}</p>}
            <div className="flex justify-end gap-3 sm:col-span-2">
                <button type="button" disabled={ocupado} onClick={cerrar} className="rounded border px-4 py-2">Cancelar</button>
                <button type="submit" disabled={ocupado || !!errorMapa || !empresaId || (cargandoOrden && !manual)}
                    className="rounded bg-red-700 px-4 py-2 text-white disabled:opacity-50">{ocupado ? 'Guardando…' : 'Guardar'}</button>
            </div>
        </form>
    </ModalPortal>
}
