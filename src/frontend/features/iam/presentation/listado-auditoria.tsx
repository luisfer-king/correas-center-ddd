import { useEffect, useState } from 'react'
import { ErrorApi } from '../../../shared/api/cliente-http'
import { iamApi } from '../api/cliente-iam'
import type { EventoAuditoriaIam } from '../api/tipos-iam'
import { csvAuditoria } from './exportar-auditoria-csv'
import { xlsxAuditoria } from './exportar-auditoria-xlsx'
import { ModalPortal } from './modal-portal'
import { nombreExportacionAuditoria } from './nombre-exportacion-auditoria'

const TAMANO_PAGINA = 25
const fecha = (valor: string | null) => valor ? new Date(valor).toLocaleString('es-BO') : 'Sin registro'
function limiteDia(dia: string, siguiente = false): string | undefined {
    if (!dia) return undefined
    const [anio, mes, numero] = dia.split('-').map(Number)
    return new Date(anio, mes - 1, numero + Number(siguiente)).toISOString()
}
type Consulta = { tipo: 'cargando' } | { tipo: 'lista'; eventos: EventoAuditoriaIam[]; siguiente: string | null }
    | { tipo: 'sin-permiso' | 'error' }

function DetalleEvento({ evento, cerrar }: { evento: EventoAuditoriaIam; cerrar: () => void }) {
    const secciones = [
        { titulo: 'Datos anteriores', valor: evento.datosAnteriores },
        { titulo: 'Datos nuevos', valor: evento.datosNuevos },
        { titulo: 'Metadatos', valor: evento.metadata },
    ]
    return <ModalPortal titulo={`Evento de auditoría ${evento.id ?? ''}`} cerrar={cerrar}>
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div><dt className="text-neutral-600">Fecha</dt><dd>{fecha(evento.creadoEn)}</dd></div>
            <div><dt className="text-neutral-600">Acción</dt><dd>{evento.accion}</dd></div>
            <div><dt className="text-neutral-600">Tabla</dt><dd className="break-all">{evento.tablaAfectada}</dd></div>
            <div><dt className="text-neutral-600">Registro</dt><dd className="break-all">{evento.registroId ?? 'Sin registro'}</dd></div>
            <div><dt className="text-neutral-600">Actor</dt><dd className="break-all">{evento.usuarioId ?? 'Sistema'}</dd></div>
            <div><dt className="text-neutral-600">IP</dt><dd>{evento.ipAddress ?? 'No registrada'}</dd></div>
            <div className="sm:col-span-2"><dt className="text-neutral-600">Agente de usuario</dt>
                <dd className="break-all">{evento.userAgent ?? 'No registrado'}</dd></div>
        </dl>
        {secciones.map(({ titulo, valor }) => <section key={titulo} className="mt-5">
            <h3 className="font-semibold">{titulo}</h3>
            <pre className="mt-2 max-h-64 overflow-auto rounded-md border border-neutral-200 bg-neutral-50 p-3 text-xs">
                {valor === null ? 'Sin datos' : JSON.stringify(valor, null, 2) ?? 'Sin datos'}
            </pre>
        </section>)}
    </ModalPortal>
}

export function ListadoAuditoria() {
    const [cursores, setCursores] = useState<(string | undefined)[]>([undefined])
    const [pagina, setPagina] = useState(0)
    const [revision, setRevision] = useState(0)
    const [consulta, setConsulta] = useState<Consulta>({ tipo: 'cargando' })
    const [detalle, setDetalle] = useState<EventoAuditoriaIam | null>(null)
    const [busqueda, setBusqueda] = useState('')
    const [accion, setAccion] = useState('todas')
    const [desde, setDesde] = useState('')
    const [hasta, setHasta] = useState('')
    const [rango, setRango] = useState<{ desde?: string; hasta?: string }>({})
    const [fechasAplicadas, setFechasAplicadas] = useState({ desde: '', hasta: '' })
    const [errorFechas, setErrorFechas] = useState('')
    const [errorExportacion, setErrorExportacion] = useState('')

    useEffect(() => {
        const controlador = new AbortController()
        setConsulta({ tipo: 'cargando' })
        void iamApi.listarAuditoria(TAMANO_PAGINA + 1, cursores[pagina],
            { signal: controlador.signal, ...rango })
            .then((datos) => {
                if (controlador.signal.aborted) return
                const eventos = datos.slice(0, TAMANO_PAGINA)
                const ultimoId = eventos.at(-1)?.id
                setConsulta({
                    tipo: 'lista', eventos,
                    siguiente: datos.length > TAMANO_PAGINA && ultimoId && /^[1-9]\d*$/.test(ultimoId) ? ultimoId : null
                })
            }).catch((fallo: unknown) => {
                if (!controlador.signal.aborted) setConsulta(fallo instanceof ErrorApi && fallo.estado === 403
                    ? { tipo: 'sin-permiso' } : { tipo: 'error' })
            })
        return () => controlador.abort()
    }, [pagina, revision])

    function actualizar() {
        setDetalle(null)
        setPagina(0)
        setCursores([undefined])
        setRevision((n) => n + 1)
    }
    function aplicarFechas() {
        if (desde && hasta && desde > hasta) {
            setErrorFechas('La fecha inicial debe ser anterior o igual a la final.')
            return
        }
        setErrorFechas('')
        setDetalle(null)
        setPagina(0)
        setCursores([undefined])
        setRango({ desde: limiteDia(desde), hasta: limiteDia(hasta, true) })
        setFechasAplicadas({ desde, hasta })
        setErrorExportacion('')
        setRevision((n) => n + 1)
    }
    function descargarVisibles(formato: 'csv' | 'xlsx') {
        if (visibles.length === 0) return
        setErrorExportacion('')
        try {
            const contenido = formato === 'csv' ? csvAuditoria(visibles) : new Uint8Array(xlsxAuditoria(visibles))
            const tipo = formato === 'csv' ? 'text/csv;charset=utf-8'
                : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            const url = URL.createObjectURL(new Blob([contenido], { type: tipo }))
            const enlace = document.createElement('a')
            enlace.href = url
            enlace.download = nombreExportacionAuditoria(fechasAplicadas, accion, pagina, formato)
            document.body.append(enlace)
            enlace.click()
            enlace.remove()
            window.setTimeout(() => URL.revokeObjectURL(url), 0)
        } catch (fallo) {
            setErrorExportacion(fallo instanceof Error ? fallo.message : 'No se pudo generar el archivo.')
        }
    }
    function siguiente() {
        if (consulta.tipo !== 'lista' || !consulta.siguiente) return
        const cursor = consulta.siguiente
        setDetalle(null)
        setCursores((anteriores) => [...anteriores.slice(0, pagina + 1), cursor])
        setPagina((n) => n + 1)
    }
    const texto = busqueda.trim().toLocaleLowerCase('es')
    const visibles = consulta.tipo === 'lista' ? consulta.eventos.filter((evento) =>
        (accion === 'todas' || evento.accion === accion) &&
        (!texto || [evento.id ?? '', evento.tablaAfectada, evento.registroId ?? '', evento.usuarioId ?? '',
        evento.metadata && typeof evento.metadata === 'object' && 'operacion' in evento.metadata
            ? String(evento.metadata.operacion) : ''].some((v) => v.toLocaleLowerCase('es').includes(texto))),
    ) : []

    return <main className="w-full px-6 py-10 sm:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
            <div><p className="text-sm font-semibold uppercase tracking-widest text-red-700">Identidad y acceso</p>
                <h1 className="mt-2 text-3xl font-semibold">Auditoría</h1>
                <p className="mt-2 text-neutral-600">Consulta los eventos registrados por el portal IAM.</p></div>
            <button type="button" onClick={actualizar}
                className="rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold">Actualizar eventos</button>
        </div>
        {consulta.tipo === 'cargando' && <p role="status" className="mt-8">Cargando eventos…</p>}
        {consulta.tipo === 'sin-permiso' && <p role="alert" className="mt-8 rounded-md bg-amber-50 p-5 text-amber-900">
            Tu cuenta no tiene el permiso iam.auditoria.read para consultar la auditoría.
        </p>}
        {consulta.tipo === 'error' && <p role="alert" className="mt-8 rounded-md bg-red-50 p-5 text-red-800">
            No se pudieron cargar los eventos. Comprueba la conexión y pulsa «Actualizar eventos».
        </p>}
        {consulta.tipo === 'error' && pagina > 0 && <button type="button" onClick={() => setPagina((n) => n - 1)}
            className="mt-4 rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold">Volver a la página anterior</button>}
        {consulta.tipo === 'lista' && <>
            <form onSubmit={(e) => { e.preventDefault(); aplicarFechas() }}
                className="mt-8 flex flex-wrap items-end gap-4 rounded-lg border border-neutral-200 bg-white p-5">
                <label className="text-sm font-medium">Desde
                    <input type="date" value={desde} onChange={(e) => setDesde(e.target.value)}
                        className="mt-2 block rounded-md border border-neutral-300 px-3 py-2" />
                </label>
                <label className="text-sm font-medium">Hasta (incluido)
                    <input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)}
                        className="mt-2 block rounded-md border border-neutral-300 px-3 py-2" />
                </label>
                <button type="submit" className="rounded-md bg-red-700 px-4 py-2 text-sm font-semibold text-white">Aplicar fechas</button>
                <button type="button" onClick={() => { setDesde(''); setHasta(''); setErrorFechas(''); setRango({}); setFechasAplicadas({ desde: '', hasta: '' }); actualizar() }}
                    className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-semibold">Quitar fechas</button>
                {errorFechas && <p role="alert" className="w-full text-sm text-red-800">{errorFechas}</p>}
            </form>
            <p className="mt-2 text-sm text-neutral-600">El rango se aplica a todas las páginas antes de paginar. La fecha final incluye el día completo en tu zona horaria.</p>
            <div className="mt-5 flex flex-wrap gap-4 rounded-lg border border-neutral-200 bg-white p-5">
                <label className="min-w-52 flex-1 text-sm font-medium">Buscar en esta página
                    <input type="search" value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
                        placeholder="Actor, tabla, registro u operación"
                        className="mt-2 block w-full rounded-md border border-neutral-300 px-3 py-2" />
                </label>
                <label className="text-sm font-medium">Acción en esta página
                    <select value={accion} onChange={(e) => setAccion(e.target.value)}
                        className="mt-2 block rounded-md border border-neutral-300 bg-white px-3 py-2">
                        <option value="todas">Todas</option><option value="Lectura">Lectura</option>
                        <option value="Creación">Creación</option><option value="Edición">Edición</option>
                        <option value="Eliminación">Eliminación</option>
                    </select>
                </label>
            </div>
            <p role="status" className="mt-4 text-sm text-neutral-600">Página {pagina + 1} · {visibles.length} de {consulta.eventos.length} eventos en esta página.</p>
            <div className="mt-3 flex flex-wrap gap-3">
                <button type="button" disabled={visibles.length === 0} onClick={() => descargarVisibles('csv')}
                    className="rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold disabled:opacity-50">Exportar CSV</button>
                <button type="button" disabled={visibles.length === 0} onClick={() => descargarVisibles('xlsx')}
                    className="rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold disabled:opacity-50">Exportar Excel (.xlsx)</button>
            </div>
            {errorExportacion && <p role="alert" className="mt-2 text-sm text-red-800">{errorExportacion}</p>}
            <p className="mt-2 text-xs text-neutral-600">Ambos archivos incluyen solo las filas visibles de esta página. El nombre indica las fechas aplicadas y la acción; sin rango usa la fecha de hoy y sin acción usa «general».</p>
            {visibles.length === 0 ? <p className="mt-6 rounded-lg border border-neutral-200 bg-white p-6">
                {consulta.eventos.length === 0 ? 'No hay eventos registrados en esta página.' : 'No hay eventos que coincidan con estos filtros en esta página.'}
            </p> : <div className="mt-4 overflow-x-auto rounded-lg border border-neutral-200 bg-white">
                <table className="w-full min-w-[820px] border-collapse text-left text-sm">
                    <caption className="sr-only">Eventos de auditoría IAM, del más reciente al más antiguo</caption>
                    <thead className="bg-neutral-50"><tr>
                        <th scope="col" className="px-5 py-4">Fecha</th><th scope="col" className="px-5 py-4">Acción</th>
                        <th scope="col" className="px-5 py-4">Tabla y registro</th><th scope="col" className="px-5 py-4">Actor</th>
                        <th scope="col" className="px-5 py-4">Detalle</th>
                    </tr></thead>
                    <tbody>{visibles.map((evento, i) => <tr key={evento.id ?? `${pagina}-${i}`} className="border-t border-neutral-200">
                        <td className="whitespace-nowrap px-5 py-4">{fecha(evento.creadoEn)}</td>
                        <td className="px-5 py-4">{evento.accion}</td>
                        <td className="px-5 py-4"><span className="font-medium">{evento.tablaAfectada}</span>
                            <span className="block break-all text-xs text-neutral-600">{evento.registroId ?? 'Sin registro'}</span></td>
                        <td className="break-all px-5 py-4 text-xs">{evento.usuarioId ?? 'Sistema'}</td>
                        <td className="px-5 py-4"><button type="button" onClick={() => setDetalle(evento)}
                            className="font-semibold text-red-700 underline">Ver evento</button></td>
                    </tr>)}</tbody>
                </table>
            </div>}
            <div className="mt-5 flex items-center justify-between gap-4">
                <button type="button" disabled={pagina === 0} onClick={() => { setDetalle(null); setPagina((n) => n - 1) }}
                    className="rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold disabled:opacity-50">Anterior</button>
                <button type="button" disabled={!consulta.siguiente} onClick={siguiente}
                    className="rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold disabled:opacity-50">Siguiente</button>
            </div>
        </>}
        {detalle && <DetalleEvento evento={detalle} cerrar={() => setDetalle(null)} />}
    </main>
}