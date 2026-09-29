import { useEffect, useState, type ReactNode } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ErrorApi } from '../../../shared/api/cliente-http'
import { ModalPortal } from '../../iam/presentation/modal-portal'
import { crmApi } from '../api/cliente-crm'
import type { BaseCrm, CapacidadesCrm, RecursoCrm } from '../api/tipos-crm'
import { mostrarCrm, type ConfiguracionCrm } from './campos-crm'
import { FormularioRecursoCrm } from './formulario-recurso-crm'

type Consulta<T> = { estado: 'cargando' } | { estado: 'lista'; datos: T[] } | { estado: 'sin-permiso' | 'error' }

export function ListadoRecursoCrm<T extends BaseCrm & { estado: string }, A extends string>({ config,
  formularioExtra, detalleExtra }: {
    config: ConfiguracionCrm<T, A>
    formularioExtra?: (registro: T | null, guardado: () => void, cerrar: () => void) => ReactNode
    detalleExtra?: (registro: T, guardado: () => void) => ReactNode
  }) {
  const recurso = config.recurso as RecursoCrm
  const [consulta, setConsulta] = useState<Consulta<T>>({ estado: 'cargando' })
  const [capacidades, setCapacidades] = useState<CapacidadesCrm | null>(null)
  const [pagina, setPagina] = useState(1)
  const [revision, setRevision] = useState(0)
  const [busqueda, setBusqueda] = useState('')
  const [estado, setEstado] = useState('todos')
  const [detalle, setDetalle] = useState<T | null>(null)
  const [errorDetalle, setErrorDetalle] = useState('')
  const [formulario, setFormulario] = useState<T | 'nuevo' | null>(null)
  const [accion, setAccion] = useState<{ registro: T; valor: A; etiqueta: string } | null>(null)
  const [procesando, setProcesando] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const { id } = useParams<{ id: string }>()
  const navegar = useNavigate()
  const actualizar = () => setRevision((valor) => valor + 1)

  useEffect(() => {
    const controlador = new AbortController()
    setConsulta({ estado: 'cargando' })
    void config.listar(pagina, { signal: controlador.signal }).then((datos) => {
      if (!controlador.signal.aborted) setConsulta({ estado: 'lista', datos })
    }).catch((fallo: unknown) => {
      if (!controlador.signal.aborted) setConsulta({ estado: fallo instanceof ErrorApi && fallo.estado === 403
        ? 'sin-permiso' : 'error' })
    })
    return () => controlador.abort()
  }, [config, pagina, revision])
  useEffect(() => {
    const controlador = new AbortController()
    void crmApi.capacidades({ signal: controlador.signal }).then((datos) => {
      if (!controlador.signal.aborted) setCapacidades(datos)
    }).catch(() => { if (!controlador.signal.aborted) setCapacidades(null) })
    return () => controlador.abort()
  }, [revision])
  useEffect(() => {
    if (!id) { setDetalle(null); setErrorDetalle(''); return }
    const controlador = new AbortController()
    setDetalle(null); setErrorDetalle('')
    void config.obtener(id, { signal: controlador.signal }).then((registro) => {
      if (!controlador.signal.aborted) setDetalle(registro)
    }).catch((fallo: unknown) => { if (!controlador.signal.aborted) setErrorDetalle(fallo instanceof ErrorApi
      && fallo.estado === 404 ? 'Registro no disponible.' : 'No se pudo cargar el detalle.') })
    return () => controlador.abort()
  }, [config, id, revision])

  const filas = consulta.estado === 'lista' ? consulta.datos : []
  const texto = busqueda.trim().toLocaleLowerCase('es')
  const visibles = filas.filter((fila) => (estado === 'todos' || fila.estado === estado) &&
    (!texto || [fila.id, ...config.columnas.map((columna) =>
      String(fila[columna.clave] ?? ''))].some((valor) => valor.toLocaleLowerCase('es').includes(texto))))
  const gestionar = capacidades?.recursos[recurso]?.gestionar === true
  const cerrarDetalle = () => { setDetalle(null); navegar(`/portal/crm/${recurso}`, { replace: true }) }
  async function confirmar() {
    if (!accion || procesando) return
    setProcesando(true); setError('')
    try {
      await config.cambiar(accion.registro.id, accion.valor)
      setAccion(null); setMensaje(`Se completó la acción: ${accion.etiqueta.toLocaleLowerCase('es')}.`)
      actualizar()
    } catch (fallo) { setError(fallo instanceof Error ? fallo.message : 'No se pudo cambiar el estado.') }
    finally { setProcesando(false) }
  }

  return <main className="w-full px-6 py-10 sm:px-10">
    <p className="text-sm font-semibold uppercase tracking-widest text-red-700">Comercial / CRM</p>
    <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
      <div><h1 className="text-3xl font-semibold">{config.titulo}</h1>
        <p className="mt-2 text-neutral-600">{config.descripcion}</p></div>
      <div className="flex gap-2">{gestionar && <button type="button" onClick={() => setFormulario('nuevo')}
        className="rounded bg-red-700 px-4 py-2 text-white">Crear registro</button>}
        <button type="button" onClick={actualizar} className="rounded border border-neutral-300 bg-white px-4 py-2">Actualizar</button></div>
    </div>
    {mensaje && <p role="status" className="mt-4 rounded bg-green-50 p-3 text-green-800">{mensaje}</p>}
    {error && <p role="alert" className="mt-4 rounded bg-red-50 p-3 text-red-800">{error}</p>}
    {errorDetalle && <p role="alert" className="mt-4 rounded bg-red-50 p-3 text-red-800">{errorDetalle}</p>}
    {consulta.estado === 'cargando' && <p role="status" className="mt-6">Cargando…</p>}
    {consulta.estado === 'sin-permiso' && <p role="alert" className="mt-6">No tienes permiso para consultar este recurso.</p>}
    {consulta.estado === 'error' && <p role="alert" className="mt-6">No se pudo cargar el listado. Pulsa «Actualizar».</p>}
    {consulta.estado === 'lista' && <>
      <div className="mt-6 flex flex-wrap gap-3 rounded-lg border border-neutral-200 bg-white p-4">
        <input aria-label="Buscar" type="search" placeholder="Buscar en esta página" value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)} className="min-w-56 rounded border border-neutral-300 p-2" />
        <select aria-label="Filtrar estado" value={estado} onChange={(e) => setEstado(e.target.value)}
          className="rounded border border-neutral-300 bg-white p-2">
          <option value="todos">Todos los estados</option>
          {[...new Set(filas.map((fila) => fila.estado))].filter((valor) => valor !== 'eliminado' ||
            capacidades?.verEliminados).map((valor) => <option key={valor} value={valor}>{valor}</option>)}
        </select>
      </div>
      <p role="status" className="mt-4 text-sm text-neutral-600">{visibles.length} de {filas.length} registros en esta página</p>
      {visibles.length === 0 ? <p className="mt-6">No hay registros para mostrar.</p> :
        <div className="mt-4 overflow-x-auto rounded-lg border border-neutral-200 bg-white">
          <table className="w-full min-w-[760px] text-left text-sm"><caption className="sr-only">{config.titulo}</caption>
            <thead className="bg-neutral-100"><tr><th scope="col" className="p-3">ID</th>
              {config.columnas.map((columna) => <th scope="col" key={columna.clave} className="p-3">{columna.titulo}</th>)}
              <th scope="col" className="p-3">Estado</th><th scope="col" className="p-3">Acciones</th></tr></thead>
            <tbody>{visibles.map((fila) => <tr key={fila.id} className="border-t border-neutral-200">
              <th scope="row" className="max-w-40 truncate p-3 font-normal" title={fila.id}>{fila.id}</th>
              {config.columnas.map((columna) => <td key={columna.clave} className="max-w-72 truncate p-3"
                title={mostrarCrm(fila[columna.clave], columna.clave)}>{mostrarCrm(fila[columna.clave], columna.clave)}</td>)}
              <td className="p-3 capitalize">{fila.estado}</td>
              <td className="p-3"><div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => navegar(`/portal/crm/${recurso}/${encodeURIComponent(fila.id)}`)}
                  className="rounded border px-2 py-1">Detalle</button>
                {gestionar && !fila.eliminadoEn && <>
                  {config.editar && <button type="button" onClick={() => setFormulario(fila)} className="rounded border px-2 py-1">Editar</button>}
                  {config.acciones.filter((item) => item.estados.includes(fila.estado)).map((item) =>
                    <button type="button" key={item.valor} onClick={() => setAccion({ registro: fila, ...item })}
                      className="rounded border border-red-300 px-2 py-1 text-red-700">{item.etiqueta}</button>)}
                </>}
              </div></td>
            </tr>)}</tbody>
          </table>
        </div>}
      <div className="mt-5 flex items-center gap-3">
        <button type="button" disabled={pagina === 1} onClick={() => setPagina((p) => p - 1)}
          className="rounded border px-3 py-2 disabled:opacity-50">Anterior</button>
        <span>Página {pagina}</span>
        <button type="button" disabled={filas.length < 100 || pagina >= 10000} onClick={() => setPagina((p) => p + 1)}
          className="rounded border px-3 py-2 disabled:opacity-50">Siguiente</button>
      </div>
    </>}
    {id && detalle && <ModalPortal titulo={`Detalle · ${config.titulo}`} cerrar={cerrarDetalle}>
      <dl className="grid gap-3 sm:grid-cols-2">{Object.entries(detalle).map(([clave, valor]) =>
        <div key={clave} className={clave === 'mensaje' ? 'sm:col-span-2' : ''}>
          <dt className="text-xs uppercase text-neutral-500">{clave}</dt>
          <dd className="break-words whitespace-pre-wrap">{mostrarCrm(valor, clave)}</dd>
        </div>)}</dl>
      {gestionar && detalleExtra?.(detalle, () => { cerrarDetalle(); actualizar() })}
    </ModalPortal>}
    {formulario && (formularioExtra ? formularioExtra(formulario === 'nuevo' ? null : formulario,
      () => { setFormulario(null); actualizar() }, () => setFormulario(null)) :
      <FormularioRecursoCrm key={formulario === 'nuevo' ? 'nuevo' : formulario.id} config={config}
        registro={formulario === 'nuevo' ? null : formulario} cerrar={() => setFormulario(null)}
        guardado={() => { setFormulario(null); actualizar() }} />)}
    {accion && <ModalPortal titulo={accion.etiqueta} cerrar={() => setAccion(null)} bloqueado={procesando}>
      <p>¿Confirmas «{accion.etiqueta}» para el registro {accion.registro.id}?</p>
      {accion.valor === 'eliminar' && <p className="mt-2 text-sm text-red-700">Esta acción realiza una baja lógica.</p>}
      {error && <p role="alert" className="mt-3 text-red-700">{error}</p>}
      <div className="mt-6 flex justify-end gap-3">
        <button type="button" disabled={procesando} onClick={() => setAccion(null)} className="rounded border px-4 py-2">Cancelar</button>
        <button type="button" disabled={procesando} onClick={() => void confirmar()}
          className="rounded bg-red-700 px-4 py-2 text-white disabled:opacity-50">Confirmar</button>
      </div>
    </ModalPortal>}
  </main>
}
